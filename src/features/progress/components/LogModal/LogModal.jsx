import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import {
    AlertTriangle,
    Dumbbell,
    Meh,
    Moon,
    Ruler,
    Scale,
    Smile,
    X,
} from 'lucide-react'
import styles from './LogModal.module.css'

const TODAY = new Date().toISOString().split('T')[0]
const INITIAL_MEASURES = {
    waist: '',
    hips: '',
    chest: '',
    arms: '',
    thighs: '',
}

const MEASUREMENTS = [
    { key: 'waist', label: 'Waist' },
    { key: 'hips', label: 'Hips' },
    { key: 'chest', label: 'Chest' },
    { key: 'arms', label: 'Arms' },
    { key: 'thighs', label: 'Thighs' },
]

const TABS = [
    { key: 'weight', label: 'Weight', Icon: Scale },
    { key: 'measurements', label: 'Measurements', Icon: Ruler },
]

const MOODS = [
    { value: 'great', label: 'Great', Icon: Smile },
    { value: 'okay', label: 'Okay', Icon: Meh },
    { value: 'tired', label: 'Tired', Icon: Moon },
    { value: 'strong', label: 'Strong', Icon: Dumbbell },
    { value: 'stressed', label: 'Stressed', Icon: AlertTriangle },
]

function kgToLbs(kg) {
    return +(kg * 2.20462).toFixed(1)
}

function lbsToKg(lbs) {
    return +(lbs / 2.20462).toFixed(1)
}

export function LogModal({ isOpen, onClose, onSave }) {
    const [tab, setTab] = useState('weight')
    const [date, setDate] = useState(TODAY)
    const [unit, setUnit] = useState('kg')
    const [weight, setWeight] = useState('')
    const [measures, setMeasures] = useState(INITIAL_MEASURES)
    const [steps, setSteps] = useState('')
    const [mood, setMood] = useState('')
    const [notes, setNotes] = useState('')
    const [errors, setErrors] = useState({})
    const [saving, setSaving] = useState(false)
    const firstFocusRef = useRef(null)

    const resetForm = useCallback(() => {
        setWeight('')
        setMeasures(INITIAL_MEASURES)
        setSteps('')
        setMood('')
        setNotes('')
        setErrors({})
    }, [])

    useEffect(() => {
        if (!isOpen) return undefined

        const focusTimer = window.setTimeout(() => {
            firstFocusRef.current?.focus()
        }, 50)

        document.body.style.overflow = 'hidden'

        return () => {
            window.clearTimeout(focusTimer)
            document.body.style.overflow = ''
        }
    }, [isOpen])

    useEffect(() => {
        if (!isOpen) return undefined

        const handler = (e) => {
            if (e.key === 'Escape') onClose()
        }

        document.addEventListener('keydown', handler)

        return () => document.removeEventListener('keydown', handler)
    }, [isOpen, onClose])

    const toggleUnit = useCallback(() => {
        setUnit((currentUnit) => {
            if (weight) {
                setWeight(currentUnit === 'kg' ? String(kgToLbs(+weight)) : String(lbsToKg(+weight)))
            }
            return currentUnit === 'kg' ? 'lbs' : 'kg'
        })
    }, [weight])

    const setMeasure = useCallback((key, value) => {
        setMeasures((current) => ({ ...current, [key]: value }))
    }, [])

    const validate = useCallback(() => {
        const nextErrors = {}
        if (tab === 'weight') {
            if (!weight) nextErrors.weight = 'Weight is required'
            if (weight && isNaN(+weight)) nextErrors.weight = 'Enter a valid number'
        }
        return nextErrors
    }, [tab, weight])

    const handleSave = useCallback(async () => {
        if (saving) return

        const nextErrors = validate()
        if (Object.keys(nextErrors).length) {
            setErrors(nextErrors)
            return
        }

        setErrors({})
        setSaving(true)

        try {
            await new Promise((resolve) => setTimeout(resolve, 600))
            onSave({
                date,
                weight: weight ? +weight : null,
                unit,
                measures,
                steps: steps ? +steps : null,
                mood,
                notes,
            })
            resetForm()
            onClose()
        } finally {
            setSaving(false)
        }
    }, [saving, validate, onSave, date, weight, unit, measures, steps, mood, notes, resetForm, onClose])

    if (!isOpen) return null

    const modalContent = (
        <div
            className={styles.overlay}
            role="dialog"
            aria-modal="true"
            aria-labelledby="log-modal-title"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2 id="log-modal-title" className={styles.modalTitle}>Log Entry</h2>
                    <button type="button" onClick={onClose} className={styles.closeBtn} aria-label="Close modal">
                        <X size={18} aria-hidden="true" />
                    </button>
                </div>

                <div className={styles.field}>
                    <label htmlFor="modal-date" className={styles.label}>Date</label>
                    <input
                        ref={firstFocusRef}
                        id="modal-date"
                        type="date"
                        value={date}
                        max={TODAY}
                        onChange={(e) => setDate(e.target.value)}
                        className={`${styles.input} ${styles.dateInput}`}
                    />
                </div>

                <div className={styles.tabs} role="tablist" aria-label="Log type">
                    {TABS.map(({ key, label, Icon }) => (
                        <button
                            key={key}
                            role="tab"
                            type="button"
                            onClick={() => setTab(key)}
                            className={`${styles.tab} ${tab === key ? styles.tabActive : ''}`}
                            aria-selected={tab === key}
                        >
                            <Icon size={15} aria-hidden="true" />
                            {label}
                        </button>
                    ))}
                </div>

                {tab === 'weight' && (
                    <div className={styles.tabContent}>
                        <div className={styles.field}>
                            <div className={styles.labelRow}>
                                <label htmlFor="modal-weight" className={styles.label}>Weight</label>
                                <button type="button" onClick={toggleUnit} className={styles.unitToggle}>
                                    <span className={unit === 'kg' ? styles.unitOn : styles.unitOff}>kg</span>
                                    <span className={styles.slash}>/</span>
                                    <span className={unit === 'lbs' ? styles.unitOn : styles.unitOff}>lbs</span>
                                </button>
                            </div>
                            <div className={styles.inputRow}>
                                <input
                                    id="modal-weight"
                                    type="number"
                                    step="0.1"
                                    min="20"
                                    max="400"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    placeholder={unit === 'kg' ? 'e.g. 78.4' : 'e.g. 172.8'}
                                    className={`${styles.input} ${errors.weight ? styles.inputError : ''}`}
                                    aria-describedby={errors.weight ? 'modal-weight-err' : undefined}
                                />
                                <span className={styles.inputSuffix}>{unit}</span>
                            </div>
                            {errors.weight ? <p id="modal-weight-err" className={styles.errorMsg} role="alert">{errors.weight}</p> : null}
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="modal-steps" className={styles.label}>Steps <span className={styles.optional}>(optional)</span></label>
                            <div className={styles.inputRow}>
                                <input
                                    id="modal-steps"
                                    type="number"
                                    min="0"
                                    max="100000"
                                    value={steps}
                                    onChange={(e) => setSteps(e.target.value)}
                                    placeholder="e.g. 8 000"
                                    className={styles.input}
                                />
                                <span className={styles.inputSuffix}>steps</span>
                            </div>
                        </div>
                    </div>
                )}

                {tab === 'measurements' && (
                    <div className={styles.tabContent}>
                        <div className={styles.measureGrid}>
                            {MEASUREMENTS.map(({ key, label }) => (
                                <div key={key} className={styles.field}>
                                    <label htmlFor={`modal-m-${key}`} className={styles.label}>{label}</label>
                                    <div className={styles.inputRow}>
                                        <input
                                            id={`modal-m-${key}`}
                                            type="number"
                                            step="0.5"
                                            min="10"
                                            max="200"
                                            value={measures[key]}
                                            onChange={(e) => setMeasure(key, e.target.value)}
                                            placeholder="cm"
                                            className={styles.input}
                                        />
                                        <span className={styles.inputSuffix}>cm</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className={styles.field}>
                    <p className={styles.label} id="modal-mood-label">Mood <span className={styles.optional}>(optional)</span></p>
                    <div className={styles.moodRow} role="group" aria-labelledby="modal-mood-label">
                        {MOODS.map(({ value, label, Icon }) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setMood(mood === value ? '' : value)}
                                className={`${styles.moodChip} ${mood === value ? styles.moodChipActive : ''}`}
                                aria-pressed={mood === value}
                            >
                                <Icon size={14} aria-hidden="true" />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.field}>
                    <label htmlFor="modal-notes" className={styles.label}>Notes <span className={styles.optional}>(optional)</span></label>
                    <textarea
                        id="modal-notes"
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any notes for today..."
                        className={styles.textarea}
                    />
                </div>

                <div className={styles.modalFooter}>
                    <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
                    <button type="button" onClick={handleSave} disabled={saving} className={styles.saveBtn}>
                        {saving ? 'Saving...' : 'Save Entry'}
                    </button>
                </div>
            </div>
        </div>
    )

    return createPortal(modalContent, document.body)
}

LogModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
}
