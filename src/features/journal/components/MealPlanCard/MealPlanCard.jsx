// MealPlanCard — single meal in the weekly plan
// Shows time, type badge, meal name, macro pills, expandable grocery list
// Shared: used inside WeeklyDietPlan and can stand alone anywhere
import { useState } from 'react'
import PropTypes from 'prop-types'
import styles from './MealPlanCard.module.css'

const TYPE_COLORS = {
  'Breakfast': { bg: '#fff8e1', color: '#92700a' },
  'Morning Snack': { bg: '#f0fdf4', color: '#3a6349' },
  'Lunch': { bg: '#eef4fa', color: '#2a4365' },
  'Afternoon Snack': { bg: '#f5f0ff', color: '#6b47c8' },
  'Dinner': { bg: '#fff0f0', color: '#a83232' },
  'Evening Snack': { bg: '#f9fafb', color: '#4b5563' },
}

export default function MealPlanCard({ meal, isNow = false, isLogged = false, onQuickLog }) {
  const [expanded, setExpanded] = useState(false)
  const typeStyle = TYPE_COLORS[meal.type] ?? { bg: '#f3f4f6', color: '#6b7280' }

  return (
    <div className={`${styles.card} ${isNow ? styles.cardNow : ''}`}>

      {/* Now indicator */}
      {isNow && <div className={styles.nowDot} aria-label="Current meal" />}

      {/* Top row — time + badge */}
      <div className={styles.topRow}>
        <span className={styles.time}>{meal.time}</span>
        <span className={styles.typeBadge} style={{ background: typeStyle.bg, color: typeStyle.color }}>
          {meal.type}
        </span>
      </div>

      {/* Meal name */}
      <h3 className={styles.name}>{meal.name}</h3>

      {/* Macro pills */}
      <div className={styles.macros}>
        <span className={`${styles.macro} ${styles.macroKcal}`}>
          <svg viewBox="0 0 20 20" fill="currentColor" className={styles.macroIcon}>
            <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.798 7.238c.512-.67 1.135-.988 1.702-.988.567 0 1.19.318 1.702.988.115.15.324.18.473.065a.34.34 0 0 0 .065-.472C12.1 6.01 11.255 5.5 10.5 5.5c-.755 0-1.6.51-2.24 1.331a.34.34 0 0 0 .066.472.34.34 0 0 0 .472-.065Z" />
          </svg>
          {meal.kcal} kcal
        </span>
        <span className={`${styles.macro} ${styles.macroP}`}>P {meal.protein}g</span>
        <span className={`${styles.macro} ${styles.macroC}`}>C {meal.carbs}g</span>
        <span className={`${styles.macro} ${styles.macroF}`}>F {meal.fat}g</span>
      </div>

      <div className={styles.actionRow}>
        {/* Grocery toggle */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className={styles.groceryToggle}
          aria-expanded={expanded}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={styles.groceryIcon}>
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          {expanded ? 'Hide' : 'Show'} groceries ({meal.groceries.length} items)
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={`${styles.chevron} ${expanded ? styles.chevronOpen : ''}`} width="14" height="14">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <button
          type="button"
          className={`${styles.quickLogBtn} ${isLogged ? styles.quickLogBtnDone : ''}`}
          onClick={onQuickLog}
          disabled={isLogged}
        >
          {isLogged ? 'Logged' : 'Quick Add'}
        </button>
      </div>

      {/* Grocery list */}
      {expanded && (
        <ul className={styles.groceryList} role="list">
          {meal.groceries.map((item) => (
            <li key={item} className={styles.groceryItem}>
              <span className={styles.groceryDot} />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

MealPlanCard.propTypes = {
  meal: PropTypes.shape({
    time: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    kcal: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    groceries: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  isNow: PropTypes.bool,
  isLogged: PropTypes.bool,
  onQuickLog: PropTypes.func,
}
