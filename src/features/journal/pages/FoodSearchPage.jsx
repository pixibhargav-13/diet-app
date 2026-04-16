// FoodSearchPage — /dashboard/journal/food-lookup
// Dedicated food nutrition lookup — search any food and see full nutrition info.
// No logging from this page; it's a pure reference tool.

import { useCallback, useMemo, useState } from 'react'
import { useFoodSearch } from '../hooks/useFoodSearch'
import { computeMacrosForGrams, getFoodDetail, getProviderStatus } from '../services/foodSearchService'
import styles from './FoodSearchPage.module.css'

// ── Colour palette for macros (matches the rest of the app)
const MACRO_COLOURS = {
    protein: '#4a90d9',
    carbs: '#e8a838',
    fat: '#e05c5c',
    fiber: '#52a878',
}

// ─────────────────────────────────────────────────────────────────────────────
export default function FoodSearchPage() {
    const { query, setQuery, results, provider, loading, error } = useFoodSearch()
    const [selected, setSelected] = useState(null)   // NormalizedFood with full data
    const [loadingDetail, setLoadingDetail] = useState(false)
    const [servingIdx, setServingIdx] = useState(0)
    const [multiplier, setMultiplier] = useState(1)
    const [customGrams, setCustomGrams] = useState('')
    const [useCustom, setUseCustom] = useState(false)
    const status = useMemo(() => getProviderStatus(), [])

    const handleSelect = useCallback(async (food) => {
        setLoadingDetail(true)
        setSelected(null)
        setServingIdx(0)
        setMultiplier(1)
        setCustomGrams('')
        setUseCustom(false)
        try {
            const full = await getFoodDetail(food)
            setSelected(full)
        } catch {
            // Degrade gracefully — show what we have
            setSelected({
                ...food,
                per100g: food.per100g ?? { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
                servings: food.servings ?? [{ label: '100 g', grams: 100 }],
            })
        } finally {
            setLoadingDetail(false)
        }
    }, [])

    const servings = selected?.servings?.length
        ? selected.servings
        : [{ label: '100 g', grams: 100 }]

    const grams = useMemo(() => {
        if (!selected) return 0
        if (useCustom) return Math.max(0, Number(customGrams) || 0)
        const base = servings[servingIdx]?.grams ?? 0
        return base * (Number(multiplier) || 0)
    }, [selected, useCustom, customGrams, servings, servingIdx, multiplier])

    const macros = useMemo(() => computeMacrosForGrams(selected, grams), [selected, grams])

    const totalMacroG = macros.protein + macros.carbs + macros.fat
    const pctOf = (g) => totalMacroG > 0 ? Math.round((g / totalMacroG) * 100) : 0

    return (
        <div className={styles.page}>
            {/* Header */}
            <header className={styles.pageHeader}>
                <div>
                    <h1 className={styles.heading}>Food Nutrition Lookup</h1>
                    <p className={styles.sub}>Search any food to see full nutritional information and serving details.</p>
                </div>
                <ProviderStatus status={status} />
            </header>

            {/* Search bar */}
            <div className={styles.searchWrap}>
                <SearchInput
                    value={query}
                    onChange={setQuery}
                    loading={loading}
                />
            </div>

            {/* Two-col layout */}
            <div className={styles.layout}>
                {/* Left — results */}
                <div className={styles.resultsCol}>
                    {!query && !results.length && (
                        <EmptySearch />
                    )}
                    {query && loading && (
                        <div className={styles.stateBox}>
                            <span className={styles.spinner} />
                            <span>Searching foods…</span>
                        </div>
                    )}
                    {query && !loading && error && (
                        <div className={styles.stateBox}>
                            <span className={styles.errIcon}>!</span>
                            <span>{error}. Results from local database shown below.</span>
                        </div>
                    )}
                    {results.length > 0 && (
                        <div className={styles.resultsList}>
                            {provider && (
                                <div className={styles.providerLine}>
                                    <span className={styles.providerBadge}>{providerLabel(provider)}</span>
                                    <span className={styles.resultCount}>{results.length} results</span>
                                </div>
                            )}
                            {results.map((food) => (
                                <ResultRow
                                    key={food.id}
                                    food={food}
                                    active={selected?.id === food.id}
                                    loading={loadingDetail && selected === null}
                                    onClick={() => handleSelect(food)}
                                />
                            ))}
                        </div>
                    )}
                    {query && !loading && results.length === 0 && !error && (
                        <div className={styles.stateBox}>
                            <span>No results for &ldquo;{query}&rdquo;</span>
                        </div>
                    )}
                </div>

                {/* Right — detail panel */}
                <div className={styles.detailCol}>
                    {loadingDetail && (
                        <div className={styles.detailCard}>
                            <div className={styles.detailLoading}>
                                <span className={styles.spinner} />
                                <span>Loading nutrition data…</span>
                            </div>
                        </div>
                    )}
                    {!loadingDetail && !selected && (
                        <DetailPlaceholder />
                    )}
                    {!loadingDetail && selected && (
                        <NutritionDetail
                            food={selected}
                            servings={servings}
                            servingIdx={servingIdx}
                            setServingIdx={setServingIdx}
                            multiplier={multiplier}
                            setMultiplier={setMultiplier}
                            useCustom={useCustom}
                            setUseCustom={setUseCustom}
                            customGrams={customGrams}
                            setCustomGrams={setCustomGrams}
                            grams={grams}
                            macros={macros}
                            totalMacroG={totalMacroG}
                            pctOf={pctOf}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components

function SearchInput({ value, onChange, loading }) {
    return (
        <div className={styles.inputWrap}>
            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
                type="text"
                className={styles.searchInput}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder='Search any food — e.g. "dal tadka", "banana", "grilled chicken", "oats"'
                autoComplete="off"
                autoFocus
            />
            {loading && <span className={styles.inputSpinner} />}
            {value && !loading && (
                <button type="button" className={styles.clearBtn} onClick={() => onChange('')} aria-label="Clear">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="12" height="12">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            )}
        </div>
    )
}

function ResultRow({ food, active, onClick }) {
    const initial = (food.name ?? '?')[0].toUpperCase()
    const kcal = food.per100g?.kcal
    return (
        <button type="button" className={`${styles.resultRow} ${active ? styles.resultRowActive : ''}`} onClick={onClick}>
            <div className={styles.resultThumb}>
                {food.photo
                    ? <img src={food.photo} alt="" className={styles.resultImg} loading="lazy" />
                    : <span className={styles.resultInitial}>{initial}</span>
                }
            </div>
            <div className={styles.resultInfo}>
                <p className={styles.resultName}>{food.name}</p>
                <p className={styles.resultMeta}>
                    {food.brand && <span className={styles.resultBrand}>{food.brand}</span>}
                    {food.brand && kcal != null && <span className={styles.dot}>·</span>}
                    {kcal != null && <span>{kcal} kcal / 100 g</span>}
                </p>
            </div>
            <span className={`${styles.sourceTag} ${styles[`src_${food.source}`]}`}>
                {sourceShort(food.source)}
            </span>
        </button>
    )
}

function NutritionDetail({
    food, servings, servingIdx, setServingIdx,
    multiplier, setMultiplier, useCustom, setUseCustom,
    customGrams, setCustomGrams, grams, macros, pctOf,
}) {
    const initial = (food.name ?? '?')[0].toUpperCase()

    return (
        <div className={styles.detailCard}>
            {/* Food identity */}
            <div className={styles.detailHead}>
                <div className={styles.detailThumb}>
                    {food.photo
                        ? <img src={food.photo} alt="" className={styles.detailImg} />
                        : <span className={styles.detailInitial}>{initial}</span>
                    }
                </div>
                <div className={styles.detailMeta}>
                    <h2 className={styles.detailName}>{food.name}</h2>
                    {food.brand && <p className={styles.detailBrand}>{food.brand}</p>}
                    <span className={`${styles.sourceChip} ${styles[`src_${food.source}`]}`}>
                        {sourceFull(food.source)}
                    </span>
                </div>
            </div>

            <div className={styles.detailDivider} />

            {/* Serving selector */}
            <section className={styles.servingSection}>
                <p className={styles.sectionTitle}>Serving size</p>
                <div className={styles.servingChips}>
                    {servings.map((s, i) => (
                        <button key={i} type="button"
                            className={`${styles.servingChip} ${!useCustom && servingIdx === i ? styles.servingChipActive : ''}`}
                            onClick={() => { setServingIdx(i); setUseCustom(false) }}
                        >
                            {s.label}
                        </button>
                    ))}
                    <button type="button"
                        className={`${styles.servingChip} ${useCustom ? styles.servingChipActive : ''}`}
                        onClick={() => setUseCustom(true)}
                    >
                        Custom
                    </button>
                </div>

                {useCustom ? (
                    <div className={styles.customRow}>
                        <input
                            type="number" min="1" step="1"
                            className={styles.customInput}
                            value={customGrams}
                            onChange={(e) => setCustomGrams(e.target.value)}
                            placeholder="Enter grams…"
                        />
                        <span className={styles.customUnit}>g</span>
                    </div>
                ) : (
                    <div className={styles.stepperRow}>
                        <button type="button" className={styles.stepBtn}
                            onClick={() => setMultiplier((m) => Math.max(0.25, Number(m) - 0.25))}
                        >−</button>
                        <input type="number" min="0.25" step="0.25"
                            className={styles.multInput}
                            value={multiplier}
                            onChange={(e) => setMultiplier(e.target.value)}
                        />
                        <button type="button" className={styles.stepBtn}
                            onClick={() => setMultiplier((m) => Number(m) + 0.25)}
                        >+</button>
                        <span className={styles.gramsLabel}>= {Math.round(grams)} g</span>
                    </div>
                )}
            </section>

            <div className={styles.detailDivider} />

            {/* Calorie hero */}
            <div className={styles.kcalHero}>
                <div className={styles.kcalRing}>
                    <span className={styles.kcalNumber}>{macros.kcal}</span>
                    <span className={styles.kcalWord}>kcal</span>
                </div>
                <p className={styles.kcalSub}>for {Math.round(grams)} g serving</p>
            </div>

            {/* Macro bars */}
            <div className={styles.macroBars}>
                <MacroBar label="Protein" value={macros.protein} pct={pctOf(macros.protein)} colour={MACRO_COLOURS.protein} />
                <MacroBar label="Carbs" value={macros.carbs} pct={pctOf(macros.carbs)} colour={MACRO_COLOURS.carbs} />
                <MacroBar label="Fat" value={macros.fat} pct={pctOf(macros.fat)} colour={MACRO_COLOURS.fat} />
                <MacroBar label="Fiber" value={macros.fiber} pct={pctOf(macros.fiber)} colour={MACRO_COLOURS.fiber} />
            </div>

            <div className={styles.detailDivider} />

            {/* Nutrition table */}
            <section>
                <p className={styles.sectionTitle}>Nutrition facts <span className={styles.perNote}>per {Math.round(grams)} g</span></p>
                <table className={styles.nutriTable}>
                    <tbody>
                        <NutriRow label="Calories" value={`${macros.kcal} kcal`} bold />
                        <NutriRow label="Total Fat" value={`${macros.fat} g`} />
                        <NutriRow label="Total Carbohydrate" value={`${macros.carbs} g`} />
                        <NutriRow label="Dietary Fiber" value={`${macros.fiber} g`} indent />
                        <NutriRow label="Protein" value={`${macros.protein} g`} />
                    </tbody>
                </table>
            </section>

            {/* Per-100g reference */}
            <div className={styles.per100Box}>
                <p className={styles.per100Title}>Reference values per 100 g</p>
                <div className={styles.per100Grid}>
                    <div className={styles.per100Cell}>
                        <span className={styles.per100Val}>{food.per100g.kcal}</span>
                        <span className={styles.per100Lbl}>kcal</span>
                    </div>
                    <div className={styles.per100Cell}>
                        <span className={styles.per100Val} style={{ color: MACRO_COLOURS.protein }}>{food.per100g.protein}g</span>
                        <span className={styles.per100Lbl}>protein</span>
                    </div>
                    <div className={styles.per100Cell}>
                        <span className={styles.per100Val} style={{ color: MACRO_COLOURS.carbs }}>{food.per100g.carbs}g</span>
                        <span className={styles.per100Lbl}>carbs</span>
                    </div>
                    <div className={styles.per100Cell}>
                        <span className={styles.per100Val} style={{ color: MACRO_COLOURS.fat }}>{food.per100g.fat}g</span>
                        <span className={styles.per100Lbl}>fat</span>
                    </div>
                    <div className={styles.per100Cell}>
                        <span className={styles.per100Val} style={{ color: MACRO_COLOURS.fiber }}>{food.per100g.fiber}g</span>
                        <span className={styles.per100Lbl}>fiber</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function MacroBar({ label, value, pct, colour }) {
    return (
        <div className={styles.macroBarRow}>
            <div className={styles.macroBarMeta}>
                <span className={styles.macroBarLabel}>{label}</span>
                <span className={styles.macroBarValue}>{value} g</span>
            </div>
            <div className={styles.macroBarTrack}>
                <div
                    className={styles.macroBarFill}
                    style={{ width: `${Math.min(100, pct)}%`, background: colour }}
                />
            </div>
            <span className={styles.macroBarPct}>{pct}%</span>
        </div>
    )
}

function NutriRow({ label, value, bold, indent }) {
    return (
        <tr className={`${styles.nutriRow} ${bold ? styles.nutriRowBold : ''} ${indent ? styles.nutriRowIndent : ''}`}>
            <td className={styles.nutriLabel}>{label}</td>
            <td className={styles.nutriValue}>{value}</td>
        </tr>
    )
}

function EmptySearch() {
    return (
        <div className={styles.emptySearch}>
            <div className={styles.emptyIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="40" height="40">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
            </div>
            <p className={styles.emptyTitle}>Search the food database</p>
            <p className={styles.emptySub}>Try &ldquo;roti&rdquo;, &ldquo;chicken breast&rdquo;, &ldquo;banana&rdquo; or any food you want to look up</p>
            <div className={styles.suggestionRow}>
                {['Roti', 'Dal Tadka', 'Banana', 'Egg', 'Oats', 'Chicken Breast', 'Paneer', 'Rice'].map((s) => (
                    <span key={s} className={styles.suggestion}>{s}</span>
                ))}
            </div>
        </div>
    )
}

function DetailPlaceholder() {
    return (
        <div className={styles.detailCard}>
            <div className={styles.detailPlaceholder}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" width="44" height="44" style={{ color: '#d1d5db' }}>
                    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                    <rect x="9" y="3" width="6" height="4" rx="1" />
                    <line x1="9" y1="12" x2="15" y2="12" />
                    <line x1="9" y1="16" x2="13" y2="16" />
                </svg>
                <p className={styles.placeholderTitle}>Select a food</p>
                <p className={styles.placeholderSub}>Click any result on the left to see full nutrition details, serving sizes and macro breakdown.</p>
            </div>
        </div>
    )
}

function ProviderStatus({ status }) {
    const items = [
        { label: 'Nutritionix', active: status.nutritionix.configured && !status.nutritionix.exhausted, warn: status.nutritionix.exhausted, dim: !status.nutritionix.configured },
        { label: 'USDA', active: status.usda.configured, dim: !status.usda.configured },
        { label: 'Local DB', active: true },
    ]
    return (
        <div className={styles.providerStatus}>
            {items.map((p) => (
                <span key={p.label}
                    className={`${styles.providerDot} ${p.active ? styles.providerDotActive : p.warn ? styles.providerDotWarn : styles.providerDotDim}`}
                    title={p.warn ? `${p.label}: quota reached` : p.dim ? `${p.label}: not configured` : `${p.label}: active`}
                >
                    {p.label}
                </span>
            ))}
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// Utils

function providerLabel(p) {
    switch (p) {
        case 'nutritionix': return 'Nutritionix'
        case 'usda': return 'USDA FoodData'
        case 'mixed': return 'Mixed sources'
        default: return 'Local database'
    }
}

function sourceShort(s) {
    return s === 'nutritionix' ? 'NX' : s === 'usda' ? 'USDA' : 'Local'
}

function sourceFull(s) {
    return s === 'nutritionix' ? 'Nutritionix' : s === 'usda' ? 'USDA FoodData' : 'Local database'
}
