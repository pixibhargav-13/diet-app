// MealContribution — single meal row: icon, name, ingredients, kcal, % of daily
// Shared: render one per meal, pass the full list from parent
import PropTypes from 'prop-types'
import styles from './MealContribution.module.css'

// Icon per meal type
function MealIcon({ type }) {
  const icons = {
    Breakfast: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
    Lunch: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        <line x1="2" y1="12" x2="22" y2="12" />
      </svg>
    ),
    Dinner: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
    Snacks: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l19-9-9 19-2-8-8-2z" />
      </svg>
    ),
  }
  return (
    <span className={styles.iconSvg}>
      {icons[type] ?? icons.Snacks}
    </span>
  )
}

MealIcon.propTypes = { type: PropTypes.string.isRequired }

export default function MealContribution({ type, ingredients, kcal, totalKcal }) {
  const pct = Math.round((kcal / totalKcal) * 100)

  return (
    <div className={styles.row}>
      <div className={styles.iconWrap} aria-hidden="true">
        <MealIcon type={type} />
      </div>
      <div className={styles.info}>
        <span className={styles.mealType}>{type}</span>
        <span className={styles.ingredients}>{ingredients}</span>
      </div>
      <div className={styles.right}>
        <span className={styles.kcal}>{kcal.toLocaleString()} kcal</span>
        <span className={styles.pct}>{pct}% of Daily</span>
      </div>
    </div>
  )
}

MealContribution.propTypes = {
  type:        PropTypes.string.isRequired,
  ingredients: PropTypes.string.isRequired,
  kcal:        PropTypes.number.isRequired,
  totalKcal:   PropTypes.number.isRequired,  // used to compute % of daily
}
