// MacroBar — one labelled progress bar for a single macronutrient
// Shared: render one per macro, each with its own colour
import PropTypes from 'prop-types'
import styles from './MacroBar.module.css'

export default function MacroBar({ name, consumed, goal, unit = 'g', color = '#2a4365' }) {
  const pct = Math.min(Math.round((consumed / goal) * 100), 100)

  return (
    <div className={styles.row}>
      {/* Label row */}
      <div className={styles.labelRow}>
        <span className={styles.name}>
          {name}
          <span className={styles.amount}> {consumed}{unit} / {goal}{unit}</span>
        </span>
        <span className={styles.pct}>{pct}%</span>
      </div>

      {/* Bar */}
      <div className={styles.track} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${name} ${pct}%`}>
        <div
          className={styles.fill}
          style={{ '--w': `${pct}%`, '--color': color }}
        />
      </div>
    </div>
  )
}

MacroBar.propTypes = {
  name:     PropTypes.string.isRequired,
  consumed: PropTypes.number.isRequired,
  goal:     PropTypes.number.isRequired,
  unit:     PropTypes.string,
  color:    PropTypes.string,
}
