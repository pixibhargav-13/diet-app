// HealthInsightBar — dark full-width bar with tip + weekly stats
// Shared: usable on any journal page that wants a health tip footer
import PropTypes from 'prop-types'
import styles from './HealthInsightBar.module.css'

export default function HealthInsightBar({ tip, stats }) {
  return (
    <div className={styles.bar} aria-label="Health insight">

      {/* Left — icon + tip */}
      <div className={styles.tipSection}>
        <div className={styles.iconWrap} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={styles.tipIcon}>
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
        <div>
          <p className={styles.tipTitle}>Health Insight</p>
          <p className={styles.tipText}>{tip}</p>
        </div>
      </div>

      {/* Right — stat chips */}
      <div className={styles.statsRow} role="list">
        {stats.map((s) => (
          <div key={s.label} className={styles.statChip} role="listitem">
            <span className={styles.statLabel}>{s.label}</span>
            <span className={styles.statValue}>{s.value}</span>
          </div>
        ))}
      </div>

    </div>
  )
}

HealthInsightBar.propTypes = {
  tip:   PropTypes.string.isRequired,
  stats: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
}
