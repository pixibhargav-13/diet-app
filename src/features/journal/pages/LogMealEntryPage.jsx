// LogMealEntryPage — /dashboard/journal/log-meal-entry
// Updated: WeeklyDietPlan section added below the form card in the left column
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNutritionStore } from '../../../store/useNutritionStore'
import { toastMealLogged, toastMealLogError } from '../../../utils/Toast'
import MealPhotoUpload from '../components/MealPhotoUpload/MealPhotoUpload'
import RecentFavourites from '../components/RecentFavourites/RecentFavourites'
import ExpertAnalysisPanel from '../components/ExpertAnalysisPanel/ExpertAnalysisPanel'
import WeeklyDietPlan from '../components/WeeklyDietPlan/WeeklyDietPlan'
import styles from './LogMealEntryPage.module.css'

const MEAL_TYPES = ['Breakfast', 'Morning Snack', 'Lunch', 'Afternoon Snack', 'Dinner', 'Late Snack']

export default function LogMealEntryPage() {
  const logCustomMeal = useNutritionStore((state) => state.logCustomMeal)
  const photoFileRef = useRef(null)
  const photoUrlRef = useRef('')

  const [photoPreview, setPhotoPreview] = useState('')
  const [mealName, setMealName] = useState('')
  const [mealType, setMealType] = useState('Lunch')
  const [kcal, setKcal] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fat, setFat] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handlePhotoSelect = useCallback((file) => {
    if (photoUrlRef.current) { URL.revokeObjectURL(photoUrlRef.current); photoUrlRef.current = '' }
    if (file) {
      photoFileRef.current = file
      const url = URL.createObjectURL(file)
      photoUrlRef.current = url
      setPhotoPreview(url)
    } else {
      photoFileRef.current = null
      setPhotoPreview('')
    }
  }, [])

  useEffect(() => () => { if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current) }, [])

  const handleFavouriteSelect = useCallback((name) => {
    setMealName(name)
    setErrors((e) => ({ ...e, mealName: undefined }))
  }, [])

  const validate = useCallback(() => {
    const e = {}
    if (!mealName.trim()) e.mealName = 'Meal name is required'
    if (!kcal || Number(kcal) <= 0) e.kcal = 'Calories are required'
    if (protein && Number(protein) < 0) e.protein = 'Protein cannot be negative'
    if (carbs && Number(carbs) < 0) e.carbs = 'Carbs cannot be negative'
    if (fat && Number(fat) < 0) e.fat = 'Fat cannot be negative'
    return e
  }, [mealName, kcal, protein, carbs, fat])

  const handleCancel = useCallback(() => {
    setMealName(''); setMealType('Lunch'); setKcal(''); setProtein(''); setCarbs(''); setFat('')
    setErrors({}); setSubmitted(false)
    handlePhotoSelect(null)
  }, [handlePhotoSelect])

  const handleSubmit = useCallback(async () => {
    if (submitting) return
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({}); setSubmitting(true)
    try {
      const result = logCustomMeal({
        mealName,
        mealType,
        kcal,
        protein,
        carbs,
        fat,
        source: 'Manual Log Entry',
      })

      if (!result.ok) {
        toastMealLogError()
        return
      }

      await new Promise((r) => setTimeout(r, 500))
      setSubmitted(true)
      toastMealLogged()
    } finally { setSubmitting(false) }
  }, [submitting, validate, logCustomMeal, mealName, mealType, kcal, protein, carbs, fat])

  return (
    <div className={styles.page}>

      {/* Page header */}
      <header className={styles.pageHeader}>
        <h1 className={styles.heading}>Log Meal Entry</h1>
      </header>

      {/* Two-column layout */}
      <div className={styles.layout}>

        {/* ── Left column ── */}
        <div className={styles.mainCol}>
          <MealPhotoUpload onFileSelect={handlePhotoSelect} preview={photoPreview} />

          {/* Log form */}
          <div className={styles.formCard}>
            <div className={styles.topRow}>
              <div className={styles.field}>
                <label htmlFor="meal-name" className={styles.label}>Meal Name / Description</label>
                <div className={styles.inputWrap}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={styles.inputIcon}>
                    <path d="M3 2h18l-2 7H5L3 2z" /><path d="M5 9c0 6 14 6 14 0" />
                    <path d="M12 13v8" /><path d="M8 21h8" />
                  </svg>
                  <input
                    id="meal-name" type="text" value={mealName}
                    onChange={(e) => { setMealName(e.target.value); setErrors((err) => ({ ...err, mealName: undefined })) }}
                    placeholder="e.g., Homemade Turkey Sandwich"
                    className={`${styles.input} ${errors.mealName ? styles.inputError : ''}`}
                    aria-describedby={errors.mealName ? 'meal-name-err' : undefined}
                  />
                </div>
                {errors.mealName && <p id="meal-name-err" className={styles.errorMsg} role="alert">{errors.mealName}</p>}
              </div>

              <div className={styles.field}>
                <label htmlFor="meal-type" className={styles.label}>Meal Type</label>
                <div className={styles.selectWrap}>
                  <select id="meal-type" value={mealType} onChange={(e) => setMealType(e.target.value)} className={styles.select}>
                    {MEAL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.selectChevron}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.macroRow}>
              <div className={styles.field}>
                <label htmlFor="meal-kcal" className={styles.label}>Calories (kcal)</label>
                <input
                  id="meal-kcal"
                  type="number"
                  min="0"
                  value={kcal}
                  onChange={(e) => {
                    setKcal(e.target.value)
                    setErrors((err) => ({ ...err, kcal: undefined }))
                  }}
                  placeholder="e.g., 450"
                  className={`${styles.input} ${errors.kcal ? styles.inputError : ''}`}
                />
                {errors.kcal ? <p className={styles.errorMsg}>{errors.kcal}</p> : null}
              </div>

              <div className={styles.field}>
                <label htmlFor="meal-protein" className={styles.label}>Protein (g)</label>
                <input
                  id="meal-protein"
                  type="number"
                  min="0"
                  value={protein}
                  onChange={(e) => {
                    setProtein(e.target.value)
                    setErrors((err) => ({ ...err, protein: undefined }))
                  }}
                  placeholder="e.g., 35"
                  className={`${styles.input} ${errors.protein ? styles.inputError : ''}`}
                />
                {errors.protein ? <p className={styles.errorMsg}>{errors.protein}</p> : null}
              </div>

              <div className={styles.field}>
                <label htmlFor="meal-carbs" className={styles.label}>Carbs (g)</label>
                <input
                  id="meal-carbs"
                  type="number"
                  min="0"
                  value={carbs}
                  onChange={(e) => {
                    setCarbs(e.target.value)
                    setErrors((err) => ({ ...err, carbs: undefined }))
                  }}
                  placeholder="e.g., 42"
                  className={`${styles.input} ${errors.carbs ? styles.inputError : ''}`}
                />
                {errors.carbs ? <p className={styles.errorMsg}>{errors.carbs}</p> : null}
              </div>

              <div className={styles.field}>
                <label htmlFor="meal-fat" className={styles.label}>Fat (g)</label>
                <input
                  id="meal-fat"
                  type="number"
                  min="0"
                  value={fat}
                  onChange={(e) => {
                    setFat(e.target.value)
                    setErrors((err) => ({ ...err, fat: undefined }))
                  }}
                  placeholder="e.g., 16"
                  className={`${styles.input} ${errors.fat ? styles.inputError : ''}`}
                />
                {errors.fat ? <p className={styles.errorMsg}>{errors.fat}</p> : null}
              </div>
            </div>

            <RecentFavourites onSelect={handleFavouriteSelect} />
          </div>

          {/* ── Weekly plan — same width as form card ── */}
          <WeeklyDietPlan />
        </div>

        {/* ── Right column — expert panel (sticky) ── */}
        <ExpertAnalysisPanel
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitting={submitting}
          submitted={submitted}
        />
      </div>
    </div>
  )
}
