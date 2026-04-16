// ServingSizePicker — modal that lets the user pick a serving size for a food,
// shows a live macro preview, and confirms back to the caller with the
// computed macros + name + grams.

import { useEffect, useMemo, useState } from 'react'
import { computeMacrosForGrams } from '../../services/foodSearchService'
import styles from './ServingSizePicker.module.css'

const CUSTOM_IDX = -1

export default function ServingSizePicker({ food, onClose, onConfirm }) {
    const servings = useMemo(
        () => (food.servings?.length ? food.servings : [{ label: '100 g', grams: 100 }]),
        [food.servings],
    )

    const [servingIdx, setServingIdx] = useState(0)
    const [multiplier, setMultiplier] = useState(1)
    const [customGrams, setCustomGrams] = useState(100)

    // Lock body scroll while open
    useEffect(() => {
        const prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = prev }
    }, [])

    // Close on Escape
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [onClose])

    const grams = useMemo(() => {
        if (servingIdx === CUSTOM_IDX) return Number(customGrams) || 0
        const base = servings[servingIdx]?.grams ?? 0
        const m = Number(multiplier) || 0
        return base * m
    }, [servingIdx, multiplier, customGrams, servings])

    const macros = useMemo(() => computeMacrosForGrams(food, grams), [food, grams])

    const canConfirm = grams > 0 && macros.kcal > 0

    const handleConfirm = () => {
        if (!canConfirm) return
        const servingLabel = servingIdx === CUSTOM_IDX
            ? `Custom (${Math.round(grams)} g)`
            : `${multiplier} × ${servings[servingIdx].label}`
        onConfirm?.({
            name: food.name,
            brand: food.brand ?? null,
            source: food.source,
            servingLabel,
            grams: macros.grams,
            kcal: macros.kcal,
            protein: macros.protein,
            carbs: macros.carbs,
            fat: macros.fat,
            fiber: macros.fiber,
        })
    }

    return (
        <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <header className={styles.header}>
                    <div className={styles.headerText}>
                        <h2 className={styles.title}>{food.name}</h2>
                        {food.brand && <p className={styles.brand}>{food.brand}</p>}
                    </div>
                    <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </header>

                <div className={styles.body}>
                    <section className={styles.section}>
                        <p className={styles.sectionLabel}>Serving size</p>
                        <div className={styles.servingGrid}>
                            {servings.map((s, i) => (
                                <button
                                    key={`${s.label}-${i}`}
                                    type="button"
                                    className={`${styles.servingChip} ${servingIdx === i ? styles.servingChipActive : ''}`}
                                    onClick={() => setServingIdx(i)}
                                >
                                    {s.label}
                                </button>
                            ))}
                            <button
                                type="button"
                                className={`${styles.servingChip} ${servingIdx === CUSTOM_IDX ? styles.servingChipActive : ''}`}
                                onClick={() => setServingIdx(CUSTOM_IDX)}
                            >
                                Custom grams
                            </button>
                        </div>
                    </section>

                    {servingIdx === CUSTOM_IDX ? (
                        <section className={styles.section}>
                            <label htmlFor="custom-grams" className={styles.sectionLabel}>Amount (grams)</label>
                            <input
                                id="custom-grams"
                                type="number"
                                min="1"
                                step="1"
                                value={customGrams}
                                onChange={(e) => setCustomGrams(e.target.value)}
                                className={styles.amountInput}
                            />
                        </section>
                    ) : (
                        <section className={styles.section}>
                            <label htmlFor="multiplier" className={styles.sectionLabel}>Number of servings</label>
                            <div className={styles.stepper}>
                                <button
                                    type="button"
                                    className={styles.stepBtn}
                                    onClick={() => setMultiplier((m) => Math.max(0.25, Number(m) - 0.5))}
                                    aria-label="Decrease"
                                >−</button>
                                <input
                                    id="multiplier"
                                    type="number"
                                    min="0.25"
                                    step="0.25"
                                    value={multiplier}
                                    onChange={(e) => setMultiplier(e.target.value)}
                                    className={styles.multInput}
                                />
                                <button
                                    type="button"
                                    className={styles.stepBtn}
                                    onClick={() => setMultiplier((m) => Number(m) + 0.5)}
                                    aria-label="Increase"
                                >+</button>
                            </div>
                            <p className={styles.helper}>= {Math.round(grams)} g total</p>
                        </section>
                    )}

                    <section className={styles.preview}>
                        <div className={styles.kcalBig}>
                            <span className={styles.kcalValue}>{macros.kcal}</span>
                            <span className={styles.kcalUnit}>kcal</span>
                        </div>
                        <div className={styles.macroGrid}>
                            <div className={styles.macroCell}>
                                <span className={styles.macroLabel}>Protein</span>
                                <span className={styles.macroValue}>{macros.protein} g</span>
                            </div>
                            <div className={styles.macroCell}>
                                <span className={styles.macroLabel}>Carbs</span>
                                <span className={styles.macroValue}>{macros.carbs} g</span>
                            </div>
                            <div className={styles.macroCell}>
                                <span className={styles.macroLabel}>Fat</span>
                                <span className={styles.macroValue}>{macros.fat} g</span>
                            </div>
                            <div className={styles.macroCell}>
                                <span className={styles.macroLabel}>Fiber</span>
                                <span className={styles.macroValue}>{macros.fiber} g</span>
                            </div>
                        </div>
                    </section>
                </div>

                <footer className={styles.footer}>
                    <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                    <button
                        type="button"
                        className={styles.addBtn}
                        onClick={handleConfirm}
                        disabled={!canConfirm}
                    >
                        Fill form
                    </button>
                </footer>
            </div>
        </div>
    )
}
