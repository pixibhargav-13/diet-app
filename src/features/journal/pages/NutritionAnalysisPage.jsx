// NutritionAnalysisPage — /dashboard/journal/nutrition-analysis
// Left: calorie ring. Right: macro bars + meal contribution list.
// Data source: today's plan + logged meals (planned + custom).
import { useMemo } from 'react'
import CalorieRing from '../components/CalorieRing/CalorieRing'
import MacroBar from '../components/MacroBar/MacroBar'
import MealContribution from '../components/MealContribution/MealContribution'
import { useNutritionStore } from '../../../store/useNutritionStore'
import styles from './NutritionAnalysisPage.module.css'

const EMPTY = []

function todayIsoDate() {
  return new Date().toISOString().split('T')[0]
}

function normalizeMealType(type) {
  if (!type) return 'Snacks'
  const lower = type.toLowerCase()
  if (lower.includes('breakfast')) return 'Breakfast'
  if (lower.includes('lunch')) return 'Lunch'
  if (lower.includes('dinner')) return 'Dinner'
  return 'Snacks'
}

// Determine macro precision label
function precisionLabel(macros) {
  const valid = macros.filter((m) => m.goal > 0)
  if (!valid.length) return { text: 'No Goal Set', tone: 'warn' }

  const avg = valid.reduce((s, m) => s + m.consumed / m.goal, 0) / valid.length
  if (avg >= 0.85) return { text: 'Optimal Range', tone: 'good' }
  if (avg >= 0.65) return { text: 'On Track', tone: 'warn' }
  return { text: 'Below Target', tone: 'danger' }
}

export default function NutritionAnalysisPage() {
  const getPlanForDate = useNutritionStore((state) => state.getPlanForDate)
  const mealLogsByDate = useNutritionStore((state) => state.mealLogsByDate)
  const date = todayIsoDate()

  const plan = getPlanForDate(date)
  const logs = mealLogsByDate[date] ?? EMPTY

  const macroGoals = useMemo(() => {
    if (!plan?.meals?.length) {
      return { kcal: 0, protein: 0, carbs: 0, fat: 0 }
    }

    return plan.meals.reduce(
      (acc, meal) => {
        acc.kcal += Number(meal.kcal) || 0
        acc.protein += Number(meal.protein) || 0
        acc.carbs += Number(meal.carbs) || 0
        acc.fat += Number(meal.fat) || 0
        acc.fiber += Number(meal.fiber) || 0
        return acc
      },
      { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    )
  }, [plan])

  const consumedTotals = useMemo(
    () => logs.reduce(
      (acc, log) => {
        acc.kcal += Number(log.kcal) || 0
        acc.protein += Number(log.protein) || 0
        acc.carbs += Number(log.carbs) || 0
        acc.fat += Number(log.fat) || 0
        acc.fiber += Number(log.fiber) || 0
        return acc
      },
      { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    ),
    [logs]
  )

  const macros = useMemo(
    () => [
      { name: 'Protein', consumed: consumedTotals.protein, goal: macroGoals.protein, color: '#2a4365' },
      { name: 'Carbohydrates', consumed: consumedTotals.carbs, goal: macroGoals.carbs, color: '#4a6fa5' },
      { name: 'Fats', consumed: consumedTotals.fat, goal: macroGoals.fat, color: '#7faad6' },
      { name: 'Fiber', consumed: consumedTotals.fiber, goal: macroGoals.fiber || 25, color: '#52a878' },
    ],
    [consumedTotals, macroGoals]
  )

  const mealContribution = useMemo(() => {
    if (logs.length) {
      const grouped = logs.reduce((acc, log) => {
        const key = normalizeMealType(log.mealType)
        if (!acc[key]) {
          acc[key] = { type: key, kcal: 0, ingredients: [] }
        }

        acc[key].kcal += Number(log.kcal) || 0
        if (log.mealName) acc[key].ingredients.push(log.mealName)
        return acc
      }, {})

      return Object.values(grouped).map((entry) => ({
        ...entry,
        ingredients: entry.ingredients.length
          ? Array.from(new Set(entry.ingredients)).slice(0, 3).join(', ')
          : 'Logged meal',
      }))
    }

    if (!plan?.meals?.length) return EMPTY

    return plan.meals.map((meal) => ({
      type: normalizeMealType(meal.type),
      ingredients: meal.name,
      kcal: Number(meal.kcal) || 0,
    }))
  }, [logs, plan])

  const totalMealKcal = mealContribution.reduce((s, m) => s + m.kcal, 0)
  const precision = precisionLabel(macros)

  const handleExport = () => {
    const csv = [
      'Macro,Consumed,Goal,Unit',
      ...macros.map((m) => `${m.name},${m.consumed},${m.goal},g`),
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `nutrition-${date}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  const handleShare = () => {
    const text = [
      `Nutrition Summary - ${date}`,
      `Calories: ${consumedTotals.kcal.toLocaleString()} / ${macroGoals.kcal.toLocaleString()} kcal`,
      ...macros.map((m) => `${m.name}: ${m.consumed}g / ${m.goal}g`),
      `Fiber: ${consumedTotals.fiber}g / ${macroGoals.fiber || 25}g`,
    ].join('\n')
    navigator.clipboard.writeText(text)
  }

  return (
    <div className={styles.page}>

      {/* Page header */}
      <header className={styles.pageHeader}>
        <div className={styles.titleCol}>
          <h1 className={styles.heading}>Nutrition Analysis</h1>
        </div>

        {/* Actions */}
        <div className={styles.headerActions}>
          <button type="button" onClick={handleShare} className={styles.shareBtn}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            Share Summary
          </button>
          <button type="button" onClick={handleExport} className={styles.exportBtn}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </button>
        </div>
      </header>

      {/* Two-column layout */}
      <div className={styles.layout}>

        {/* Left — calorie ring */}
        <div className={styles.leftCard}>
          <CalorieRing consumed={consumedTotals.kcal} goal={macroGoals.kcal} />
        </div>

        {/* Right — macros + meals */}
        <div className={styles.rightCol}>

          {/* Macronutrient precision */}
          <div className={styles.rightCard}>
            <div className={styles.macroHeader}>
              <p className={styles.cardSectionLabel}>Macronutrient Precision</p>
              <span className={`${styles.precisionBadge} ${styles[precision.tone]}`}>
                {precision.text}
              </span>
            </div>
            <div className={styles.macroList}>
              {macros.map((m) => (
                <MacroBar key={m.name} name={m.name} consumed={m.consumed} goal={m.goal} color={m.color} />
              ))}
            </div>
          </div>

          {/* Meal contribution */}
          <div className={styles.rightCard}>
            <p className={styles.cardSectionLabel}>Meal Contribution</p>
            <div className={styles.mealList}>
              {mealContribution.map((m, index) => (
                <MealContribution
                  key={`${m.type}-${index}`}
                  type={m.type}
                  ingredients={m.ingredients}
                  kcal={m.kcal}
                  totalKcal={totalMealKcal}
                />
              ))}
              {!mealContribution.length && (
                <p className={styles.emptyState}>No plan or meal logs available for today.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
