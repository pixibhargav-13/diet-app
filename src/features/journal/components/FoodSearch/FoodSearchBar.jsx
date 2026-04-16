// FoodSearchBar — search input + dropdown of results.
// Sits above the manual meal-entry form. Selecting a result opens the
// ServingSizePicker, which in turn calls onPick with final macros.

import { useCallback, useEffect, useRef, useState } from 'react'
import { useFoodSearch } from '../../hooks/useFoodSearch'
import { getFoodDetail, getProviderStatus } from '../../services/foodSearchService'
import FoodResultCard from './FoodResultCard'
import ServingSizePicker from './ServingSizePicker'
import styles from './FoodSearchBar.module.css'

export default function FoodSearchBar({ onPick }) {
    const { query, setQuery, results, loading, error, provider, reset } = useFoodSearch()
    const [open, setOpen] = useState(false)
    const [pickerFood, setPickerFood] = useState(null)
    const [loadingDetail, setLoadingDetail] = useState(false)
    const [status] = useState(() => getProviderStatus())

    const wrapRef = useRef(null)

    // Close dropdown on outside click
    useEffect(() => {
        function handler(e) {
            if (!wrapRef.current?.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const handleSelect = useCallback(async (food) => {
        setOpen(false)
        setLoadingDetail(true)
        try {
            const detailed = await getFoodDetail(food)
            setPickerFood(detailed)
        } catch (err) {
            console.error('[FoodSearchBar] detail fetch failed:', err)
            // Open picker with stub anyway so user can still pick a serving
            setPickerFood({
                ...food,
                per100g: food.per100g ?? { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
                servings: food.servings ?? [{ label: '100 g', grams: 100 }],
            })
        } finally {
            setLoadingDetail(false)
        }
    }, [])

    const handleConfirm = useCallback((payload) => {
        onPick?.(payload)
        setPickerFood(null)
        reset()
    }, [onPick, reset])

    const placeholder = status.nutritionix.configured
        ? 'Search any food — e.g. "1 bowl dal", "2 rotis", "grilled chicken"'
        : 'Search foods — try "roti", "banana", "chicken"'

    const showDropdown = open && (loading || results.length > 0 || error)

    return (
        <div className={styles.wrap} ref={wrapRef}>
            <div className={styles.inputRow}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.searchIcon}>
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                    type="text"
                    className={styles.input}
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
                    onFocus={() => setOpen(true)}
                    placeholder={placeholder}
                    aria-label="Search food database"
                    autoComplete="off"
                />
                {query && (
                    <button type="button" className={styles.clearBtn} onClick={reset} aria-label="Clear search">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                )}
                {loadingDetail && <span className={styles.miniSpinner} aria-label="Loading details" />}
            </div>

            {/* Hint line when not configured */}
            {!status.nutritionix.configured && !status.usda.configured && query.length >= 2 && (
                <p className={styles.hint}>
                    API keys not configured — showing results from local database only.
                </p>
            )}
            {status.nutritionix.configured && status.nutritionix.exhausted && (
                <p className={styles.hint}>
                    Daily Nutritionix quota reached. Using USDA fallback until midnight UTC.
                </p>
            )}

            {showDropdown && (
                <div className={styles.dropdown} role="listbox">
                    {loading && (
                        <div className={styles.stateRow}>
                            <span className={styles.spinner} />
                            <span>Searching foods…</span>
                        </div>
                    )}
                    {!loading && error && (
                        <div className={styles.stateRow}>
                            <span className={styles.errDot} />
                            <span>{error}. Try again or enter manually below.</span>
                        </div>
                    )}
                    {!loading && !error && results.length === 0 && query.length >= 2 && (
                        <div className={styles.stateRow}>
                            <span>No foods found for &ldquo;{query}&rdquo;. You can still enter values manually below.</span>
                        </div>
                    )}
                    {!loading && results.length > 0 && (
                        <>
                            {provider && (
                                <div className={styles.providerRow}>
                                    <span className={styles.providerBadge}>
                                        {providerLabel(provider)}
                                    </span>
                                </div>
                            )}
                            <ul className={styles.list}>
                                {results.map((food) => (
                                    <li key={food.id}>
                                        <FoodResultCard food={food} onClick={() => handleSelect(food)} />
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            )}

            {pickerFood && (
                <ServingSizePicker
                    food={pickerFood}
                    onClose={() => setPickerFood(null)}
                    onConfirm={handleConfirm}
                />
            )}
        </div>
    )
}

function providerLabel(p) {
    switch (p) {
        case 'nutritionix': return 'Nutritionix'
        case 'usda': return 'USDA FoodData'
        case 'mixed': return 'Mixed sources'
        case 'mock':
        default: return 'Local database'
    }
}
