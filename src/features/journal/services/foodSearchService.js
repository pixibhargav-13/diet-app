// foodSearchService.js
// Unified food search with a three-tier provider chain:
//   1) Nutritionix (primary)  — best NLP, Indian foods, photos
//   2) USDA FoodData Central  — fallback when Nutritionix quota is exhausted
//   3) Local mock DB          — final safety net if both APIs fail / no keys
//
// Output is normalized to a single shape so the UI is provider-agnostic:
//
//   NormalizedFood = {
//     id:       string,                                 // globally unique
//     name:     string,
//     brand:    string | null,
//     source:   'nutritionix' | 'usda' | 'mock',
//     photo:    string | null,                          // thumbnail url
//     per100g:  { kcal, protein, carbs, fat, fiber },
//     servings: [{ label: string, grams: number }]
//   }
//
// Quota handling:
//   When Nutritionix returns 429 (or 403 w/ "usage limits exceeded"), OR the
//   `x-ratelimit-remaining` header is 0, we flag Nutritionix as exhausted for
//   the rest of the UTC day (stored in localStorage) and route to USDA without
//   hitting Nutritionix again.

import { MOCK_FOODS, searchMockFoods } from '../data/mockFoodDatabase'

// ─────────────────────────────────────────────────────────────────────────────
// Config

const NX_APP_ID = import.meta.env?.VITE_NUTRITIONIX_APP_ID ?? ''
const NX_APP_KEY = import.meta.env?.VITE_NUTRITIONIX_APP_KEY ?? ''
const USDA_KEY = import.meta.env?.VITE_USDA_API_KEY ?? ''

const NX_INSTANT = 'https://trackapi.nutritionix.com/v2/search/instant'
const NX_NUTRIENTS = 'https://trackapi.nutritionix.com/v2/natural/nutrients'
const USDA_SEARCH = 'https://api.nal.usda.gov/fdc/v1/foods/search'
const USDA_DETAIL = 'https://api.nal.usda.gov/fdc/v1/food'

const NX_EXHAUSTED_KEY = 'vitals-nx-exhausted-until'
const DEBUG = import.meta.env?.DEV ?? false

// USDA nutrient ids (stable across their dataset)
const USDA_NUTRIENT = {
    kcal: 1008,
    protein: 1003,
    fat: 1004,
    carbs: 1005,
    fiber: 1079,
}

// ─────────────────────────────────────────────────────────────────────────────
// Quota state — persisted in localStorage until next UTC midnight.

function nextUtcMidnight() {
    const now = new Date()
    const midnight = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1,
        0, 0, 0, 0,
    ))
    return midnight.getTime()
}

function isNutritionixExhausted() {
    if (typeof localStorage === 'undefined') return false
    const until = Number(localStorage.getItem(NX_EXHAUSTED_KEY))
    if (!until) return false
    if (Date.now() >= until) {
        localStorage.removeItem(NX_EXHAUSTED_KEY)
        return false
    }
    return true
}

function markNutritionixExhausted() {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(NX_EXHAUSTED_KEY, String(nextUtcMidnight()))
    if (DEBUG) console.warn('[foodSearch] Nutritionix quota exhausted — falling back to USDA until UTC midnight.')
}

function hasNutritionixKeys() {
    return Boolean(NX_APP_ID && NX_APP_KEY)
}

function hasUsdaKey() {
    return Boolean(USDA_KEY)
}

function isRateLimitError(res) {
    if (!res) return false
    if (res.status === 429) return true
    if (res.status === 403) {
        // Nutritionix uses 403 for quota-exceeded in some tiers
        return true
    }
    if (res.headers) {
        const remaining = res.headers.get?.('x-ratelimit-remaining')
        if (remaining !== null && remaining !== undefined && Number(remaining) <= 0) return true
    }
    return false
}

// ─────────────────────────────────────────────────────────────────────────────
// Nutritionix

async function nxInstantSearch(query) {
    const url = `${NX_INSTANT}?query=${encodeURIComponent(query)}`
    const res = await fetch(url, {
        headers: {
            'x-app-id': NX_APP_ID,
            'x-app-key': NX_APP_KEY,
            'x-remote-user-id': '0',
        },
    })

    if (isRateLimitError(res)) {
        markNutritionixExhausted()
        const err = new Error('Nutritionix quota exhausted')
        err.code = 'NX_QUOTA'
        throw err
    }
    if (!res.ok) throw new Error(`Nutritionix instant search failed: ${res.status}`)

    const json = await res.json()
    const common = (json.common ?? []).slice(0, 6).map((item) => ({
        id: `nx-c-${item.tag_id ?? item.food_name}`,
        name: item.food_name,
        brand: null,
        source: 'nutritionix',
        photo: item.photo?.thumb ?? null,
        __nxQuery: item.food_name, // used by detail fetch
        per100g: null,             // filled on pick
        servings: null,            // filled on pick
        _stub: true,
    }))
    const branded = (json.branded ?? []).slice(0, 4).map((item) => ({
        id: `nx-b-${item.nix_item_id}`,
        name: item.food_name,
        brand: item.brand_name ?? null,
        source: 'nutritionix',
        photo: item.photo?.thumb ?? null,
        __nxItemId: item.nix_item_id,
        per100g: null,
        servings: null,
        _stub: true,
    }))
    return [...common, ...branded]
}

// Fetch full nutrients for a Nutritionix result. Handles both:
//   - "common" foods via the /natural/nutrients POST (takes a query string)
//   - "branded" items via /v2/search/item?nix_item_id=…
async function nxGetDetail(stub) {
    if (stub.__nxItemId) {
        const res = await fetch(
            `https://trackapi.nutritionix.com/v2/search/item?nix_item_id=${stub.__nxItemId}`,
            {
                headers: {
                    'x-app-id': NX_APP_ID,
                    'x-app-key': NX_APP_KEY,
                },
            },
        )
        if (isRateLimitError(res)) {
            markNutritionixExhausted()
            const err = new Error('Nutritionix quota exhausted'); err.code = 'NX_QUOTA'; throw err
        }
        if (!res.ok) throw new Error(`Nutritionix branded detail failed: ${res.status}`)
        const json = await res.json()
        const f = json.foods?.[0]
        if (!f) throw new Error('Nutritionix branded detail: empty')
        return normalizeNxFood(f, stub)
    }

    // Common food — use natural language endpoint
    const res = await fetch(NX_NUTRIENTS, {
        method: 'POST',
        headers: {
            'x-app-id': NX_APP_ID,
            'x-app-key': NX_APP_KEY,
            'x-remote-user-id': '0',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: stub.__nxQuery || stub.name }),
    })
    if (isRateLimitError(res)) {
        markNutritionixExhausted()
        const err = new Error('Nutritionix quota exhausted'); err.code = 'NX_QUOTA'; throw err
    }
    if (!res.ok) throw new Error(`Nutritionix detail failed: ${res.status}`)
    const json = await res.json()
    const f = json.foods?.[0]
    if (!f) throw new Error('Nutritionix detail: empty')
    return normalizeNxFood(f, stub)
}

function normalizeNxFood(f, stub) {
    // Nutritionix returns values for a specified serving (serving_weight_grams).
    // Convert to per-100g so the UI can scale to any serving.
    const servingGrams = Number(f.serving_weight_grams) || 100
    const factor = 100 / servingGrams

    const per100g = {
        kcal: round(Number(f.nf_calories) * factor),
        protein: round(Number(f.nf_protein) * factor),
        carbs: round(Number(f.nf_total_carbohydrate) * factor),
        fat: round(Number(f.nf_total_fat) * factor),
        fiber: round(Number(f.nf_dietary_fiber) * factor),
    }

    // Build serving options from the main serving + alt_measures if present.
    const servings = []
    if (f.serving_qty && f.serving_unit && servingGrams) {
        servings.push({
            label: `${f.serving_qty} ${f.serving_unit} (${Math.round(servingGrams)} g)`,
            grams: servingGrams,
        })
    }
    if (Array.isArray(f.alt_measures)) {
        for (const m of f.alt_measures) {
            const g = Number(m.serving_weight) / Number(m.qty || 1)
            if (!Number.isFinite(g) || g <= 0) continue
            const totalG = g * Number(m.qty || 1)
            const label = `${m.qty} ${m.measure} (${Math.round(totalG)} g)`
            if (!servings.some((s) => s.label === label)) {
                servings.push({ label, grams: totalG })
            }
        }
    }
    servings.push({ label: '100 g', grams: 100 })

    return {
        id: stub.id,
        name: f.food_name ?? stub.name,
        brand: f.brand_name ?? stub.brand ?? null,
        source: 'nutritionix',
        photo: f.photo?.thumb ?? stub.photo ?? null,
        per100g,
        servings,
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// USDA FoodData Central

async function usdaSearch(query) {
    const url = `${USDA_SEARCH}?api_key=${USDA_KEY}&query=${encodeURIComponent(query)}&pageSize=10&dataType=Foundation,SR%20Legacy,Branded`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`USDA search failed: ${res.status}`)
    const json = await res.json()
    return (json.foods ?? []).slice(0, 10).map((f) => normalizeUsdaFood(f))
}

async function usdaGetDetail(stub) {
    // USDA search already returns full nutrient data, so we don't usually need a
    // second call. This exists so callers can treat all providers the same.
    if (stub.per100g) return stub
    const url = `${USDA_DETAIL}/${stub.__fdcId}?api_key=${USDA_KEY}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`USDA detail failed: ${res.status}`)
    const json = await res.json()
    return normalizeUsdaFood(json)
}

function normalizeUsdaFood(f) {
    const getNutrient = (id) => {
        // `foodNutrients` has two shapes depending on the endpoint.
        const arr = f.foodNutrients ?? []
        const hit = arr.find((n) => (n.nutrientId ?? n.nutrient?.id) === id)
        if (!hit) return 0
        return Number(hit.value ?? hit.amount ?? 0) || 0
    }

    // USDA foundation/sr-legacy data is reported per 100 g by default.
    const per100g = {
        kcal: round(getNutrient(USDA_NUTRIENT.kcal)),
        protein: round(getNutrient(USDA_NUTRIENT.protein)),
        carbs: round(getNutrient(USDA_NUTRIENT.carbs)),
        fat: round(getNutrient(USDA_NUTRIENT.fat)),
        fiber: round(getNutrient(USDA_NUTRIENT.fiber)),
    }

    const servings = []
    const servingSize = Number(f.servingSize)
    if (Number.isFinite(servingSize) && servingSize > 0 && f.servingSizeUnit === 'g') {
        servings.push({
            label: `${f.householdServingFullText || `${servingSize} g`} (${Math.round(servingSize)} g)`,
            grams: servingSize,
        })
    }
    servings.push({ label: '100 g', grams: 100 })

    return {
        id: `usda-${f.fdcId}`,
        __fdcId: f.fdcId,
        name: f.description ?? 'Unknown food',
        brand: f.brandOwner || f.brandName || null,
        source: 'usda',
        photo: null, // USDA has no photos
        per100g,
        servings,
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Mock

function mockSearch(query) {
    return searchMockFoods(query, 8).map((f) => ({ ...f })) // clone to avoid mutation
}

function mockGetDetail(stub) {
    // Mock results already have full data
    const match = MOCK_FOODS.find((f) => f.id === stub.id)
    return match ? { ...match } : stub
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API

/**
 * Search foods across all providers. Always returns an array (may be empty).
 * Results from the mock DB are merged in for the first page so Indian foods
 * stay discoverable even when APIs are down.
 *
 * @param {string} query
 * @param {{ signal?: AbortSignal }} [opts]
 * @returns {Promise<{ results: NormalizedFood[], provider: 'nutritionix'|'usda'|'mock'|'mixed' }>}
 */
export async function searchFoods(query, opts = {}) {
    const q = query?.trim()
    if (!q || q.length < 2) return { results: [], provider: 'mock' }

    const mockHits = mockSearch(q)

    // 1) Try Nutritionix if we have keys AND not currently quota-exhausted.
    if (hasNutritionixKeys() && !isNutritionixExhausted()) {
        try {
            const nx = await nxInstantSearch(q)
            if (opts.signal?.aborted) throw new DOMException('Aborted', 'AbortError')
            // Merge: Nutritionix first (richer), then mock items not already covered by name.
            const nxNames = new Set(nx.map((x) => x.name.toLowerCase()))
            const extras = mockHits.filter((m) => !nxNames.has(m.name.toLowerCase()))
            return { results: [...nx, ...extras], provider: extras.length ? 'mixed' : 'nutritionix' }
        } catch (err) {
            if (err.code === 'NX_QUOTA') {
                // Fall through to USDA
                if (DEBUG) console.info('[foodSearch] Nutritionix quota hit, trying USDA…')
            } else if (err.name === 'AbortError') {
                throw err
            } else {
                if (DEBUG) console.warn('[foodSearch] Nutritionix error:', err.message)
            }
        }
    }

    // 2) Try USDA
    if (hasUsdaKey()) {
        try {
            const usda = await usdaSearch(q)
            if (opts.signal?.aborted) throw new DOMException('Aborted', 'AbortError')
            const usdaNames = new Set(usda.map((x) => x.name.toLowerCase()))
            const extras = mockHits.filter((m) => !usdaNames.has(m.name.toLowerCase()))
            return { results: [...usda, ...extras], provider: extras.length ? 'mixed' : 'usda' }
        } catch (err) {
            if (err.name === 'AbortError') throw err
            if (DEBUG) console.warn('[foodSearch] USDA error:', err.message)
        }
    }

    // 3) Mock only
    return { results: mockHits, provider: 'mock' }
}

/**
 * Get the full detail (per100g + servings) for a search result.
 * Needed for Nutritionix stubs; USDA/mock results already carry full data.
 *
 * @param {NormalizedFood} food
 * @returns {Promise<NormalizedFood>}
 */
export async function getFoodDetail(food) {
    if (!food) throw new Error('getFoodDetail: food is required')
    if (food.source === 'mock') return mockGetDetail(food)
    if (food.source === 'usda') return usdaGetDetail(food)
    if (food.source === 'nutritionix') {
        if (isNutritionixExhausted()) {
            // Fallback: return whatever we know (name only). UI will show a
            // warning and let the user enter values manually.
            return {
                ...food,
                per100g: food.per100g ?? { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
                servings: food.servings ?? [{ label: '100 g', grams: 100 }],
            }
        }
        return nxGetDetail(food)
    }
    throw new Error(`getFoodDetail: unknown source ${food.source}`)
}

/**
 * Scale a food's per-100g macros to a specific gram weight.
 * @param {NormalizedFood} food
 * @param {number} grams
 */
export function computeMacrosForGrams(food, grams) {
    const g = Number(grams)
    if (!food?.per100g || !Number.isFinite(g) || g <= 0) {
        return { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, grams: 0 }
    }
    const f = g / 100
    return {
        kcal: round(food.per100g.kcal * f),
        protein: round(food.per100g.protein * f, 1),
        carbs: round(food.per100g.carbs * f, 1),
        fat: round(food.per100g.fat * f, 1),
        fiber: round(food.per100g.fiber * f, 1),
        grams: Math.round(g),
    }
}

/**
 * Introspect configured providers. Useful for the UI to show status dots.
 */
export function getProviderStatus() {
    return {
        nutritionix: {
            configured: hasNutritionixKeys(),
            exhausted: isNutritionixExhausted(),
        },
        usda: { configured: hasUsdaKey() },
        mock: { configured: true },
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Utils

function round(n, places = 0) {
    if (!Number.isFinite(n)) return 0
    const p = 10 ** places
    return Math.round(n * p) / p
}
