// CalorieRing — SVG donut showing consumed vs goal, with remaining + completion tiles
// Shared: reusable in dashboard home widget and nutrition page
import PropTypes from 'prop-types'
import styles from './CalorieRing.module.css'

const R    = 110
const CIRC = 2 * Math.PI * R

export default function CalorieRing({ consumed, goal }) {
  const pct  = Math.min(consumed / goal, 1)
  const dash = pct * CIRC
  const remaining  = Math.max(goal - consumed, 0)
  const completion = Math.round(pct * 100)

  return (
    <div className={styles.wrap}>
      <p className={styles.sectionLabel}>Daily Calorie Balance</p>

      {/* Donut */}
      <div className={styles.ringWrap}>
        <svg viewBox="0 0 280 280" className={styles.svg} aria-hidden="true">
          {/* Track */}
          <circle
            cx="140" cy="140" r={R}
            fill="none" stroke="#e5e7eb" strokeWidth="18"
          />
          {/* Fill */}
          <circle
            cx="140" cy="140" r={R}
            fill="none"
            stroke="#2a4365"
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${CIRC}`}
            transform="rotate(-90 140 140)"
            className={styles.fillArc}
            style={{ '--dash': dash, '--circ': CIRC }}
          />
        </svg>

        {/* Center text */}
        <div className={styles.center}>
          <span className={styles.consumed}>
            {consumed.toLocaleString()}
          </span>
          <span className={styles.consumedLabel}>Consumed</span>
          <span className={styles.goalLabel}>Goal: {goal.toLocaleString()} kcal</span>
        </div>
      </div>

      {/* Stat tiles */}
      <div className={styles.tiles}>
        <div className={styles.tile}>
          <span className={styles.tileValue} style={{ color: remaining > 0 ? '#2a4365' : '#4a7c59' }}>
            {remaining.toLocaleString()}
          </span>
          <span className={styles.tileLabel}>Remaining</span>
        </div>
        <div className={styles.tile}>
          <span className={styles.tileValue}>{completion}%</span>
          <span className={styles.tileLabel}>Completion</span>
        </div>
      </div>
    </div>
  )
}

CalorieRing.propTypes = {
  consumed: PropTypes.number.isRequired,
  goal:     PropTypes.number.isRequired,
}
