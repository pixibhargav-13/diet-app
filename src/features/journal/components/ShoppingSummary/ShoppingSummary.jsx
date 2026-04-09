// ShoppingSummary — dark right-panel card: progress bar + purchased/remaining tiles
// Shared: reusable in any shopping/checklist context
import PropTypes from 'prop-types'
import styles from './ShoppingSummary.module.css'

export default function ShoppingSummary({ total, purchased }) {
  const remaining = total - purchased
  const pct       = total > 0 ? Math.round((purchased / total) * 100) : 0

  return (
    <div className={styles.card} aria-label="Shopping summary">
      <div className={styles.header}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={styles.headerIcon}>
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
        <h2 className={styles.title}>Shopping Summary</h2>
      </div>

      {/* Progress bar */}
      <div className={styles.progressRow}>
        <span className={styles.progressLabel}>Progress</span>
        <span className={styles.progressPct}>{pct}% Complete</span>
      </div>
      <div className={styles.track} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className={styles.fill} style={{ width: `${pct}%` }} />
      </div>

      {/* Tiles */}
      <div className={styles.tiles}>
        <div className={styles.tile}>
          <span className={styles.tileLabel}>Purchased</span>
          <span className={styles.tileValue}>{purchased}</span>
        </div>
        <div className={styles.tile}>
          <span className={styles.tileLabel}>Remaining</span>
          <span className={styles.tileValue}>{remaining}</span>
        </div>
      </div>
    </div>
  )
}

ShoppingSummary.propTypes = {
  total:     PropTypes.number.isRequired,
  purchased: PropTypes.number.isRequired,
}
