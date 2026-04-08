// WeeklyDietPlan — 7-day tab selector + selected day meal list
// Default: today. Shows total kcal per day in the tab.
// Shared: can be dropped into LogMealEntryPage or any journal page.
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNutritionStore } from '../../../../store/useNutritionStore'
import { WEEKLY_PLAN } from '../../../../store/weeklyPlanData'
import { toastInfo, toastMealLogged, toastWarning } from '../../../../utils/Toast'
import MealPlanCard from '../MealPlanCard/MealPlanCard'
import styles from './WeeklyDietPlan.module.css'

const EMPTY_LOGS = []

// Determine which meal is "now" based on current time
function getNowMealId(meals, nowTick) {
  const now = new Date(nowTick)
  const mins = now.getHours() * 60 + now.getMinutes()

  // Parse "HH:MM AM/PM" → total minutes
  const toMins = (t) => {
    const [time, period] = t.split(' ')
    let [h, m] = time.split(':').map(Number)
    if (period === 'PM' && h !== 12) h += 12
    if (period === 'AM' && h === 12) h = 0
    return h * 60 + m
  }

  // Find the closest upcoming meal
  const upcoming = meals.filter((m) => toMins(m.time) >= mins)
  return upcoming.length ? upcoming[0].id : meals[meals.length - 1].id
}

export default function WeeklyDietPlan() {
  const [selectedDay, setSelectedDay] = useState(0)   // 0 = today
  const [nowTick, setNowTick] = useState(() => Date.now())
  const quickLogPlannedMeal = useNutritionStore((state) => state.quickLogPlannedMeal)
  const mealLogsByDate = useNutritionStore((state) => state.mealLogsByDate)
  const plan = WEEKLY_PLAN[selectedDay]
  const logsForDay = mealLogsByDate[plan.date] ?? EMPTY_LOGS

  useEffect(() => {
    const timerId = setInterval(() => setNowTick(Date.now()), 60_000)
    return () => clearInterval(timerId)
  }, [])

  const loggedMealIds = useMemo(
    () => new Set(logsForDay.map((entry) => entry.planMealId).filter(Boolean)),
    [logsForDay]
  )

  const handleQuickAddMeal = useCallback((mealId) => {
    const result = quickLogPlannedMeal(plan.date, mealId, 'Weekly Plan Quick Add')

    if (result.ok) {
      toastMealLogged()
      return
    }

    if (result.reason === 'ALREADY_LOGGED') {
      toastInfo('This meal is already logged for today.')
      return
    }

    toastWarning('Unable to add this meal right now.')
  }, [plan.date, quickLogPlannedMeal])

  const nowId = selectedDay === 0 ? getNowMealId(plan.meals, nowTick) : null

  return (
    <section className={styles.section} aria-label="Weekly diet plan">

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.badge}>Nutritionist Plan</div>
          <h2 className={styles.title}>Weekly Meal Schedule</h2>
          <p className={styles.subtitle}>
            {plan.meals.length}-meal plan &bull; {plan.totalKcal.toLocaleString()} kcal today
          </p>
        </div>
        <Link to="/dashboard/journal/grocery-list" className={styles.groceryLink}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          Full Grocery List
        </Link>
      </div>

      {/* Day tabs — horizontal scroll on mobile */}
      <div className={styles.dayTabs} role="tablist" aria-label="Select day">
        {WEEKLY_PLAN.map((day, i) => (
          <button
            key={day.date}
            role="tab"
            type="button"
            onClick={() => setSelectedDay(i)}
            className={`${styles.dayTab} ${selectedDay === i ? styles.dayTabActive : ''} ${i === 0 ? styles.dayTabToday : ''}`}
            aria-selected={selectedDay === i}
          >
            <span className={styles.dayName}>{day.name}</span>
            <span className={styles.dayNum}>{day.day}</span>
            {i === 0 && <span className={styles.todayDot} />}
          </button>
        ))}
      </div>

      {/* Day summary strip */}
      <div className={styles.daySummary}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Meals</span>
          <span className={styles.summaryValue}>{plan.meals.length}</span>
        </div>
        <div className={styles.summaryDivider} />
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Total Kcal</span>
          <span className={styles.summaryValue}>{plan.totalKcal.toLocaleString()}</span>
        </div>
        <div className={styles.summaryDivider} />
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Protein</span>
          <span className={styles.summaryValue}>{plan.meals.reduce((s, m) => s + m.protein, 0)}g</span>
        </div>
        <div className={styles.summaryDivider} />
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Carbs</span>
          <span className={styles.summaryValue}>{plan.meals.reduce((s, m) => s + m.carbs, 0)}g</span>
        </div>
        <div className={styles.summaryDivider} />
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Fat</span>
          <span className={styles.summaryValue}>{plan.meals.reduce((s, m) => s + m.fat, 0)}g</span>
        </div>
      </div>

      {/* Meal cards grid */}
      <div className={styles.mealGrid}>
        {plan.meals.map((meal) => (
          <MealPlanCard
            key={`${plan.date}-${meal.id}`}
            meal={meal}
            isNow={meal.id === nowId}
            isLogged={loggedMealIds.has(meal.id)}
            onQuickLog={() => handleQuickAddMeal(meal.id)}
          />
        ))}
      </div>

    </section>
  )
}
