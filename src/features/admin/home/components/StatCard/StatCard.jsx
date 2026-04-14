// StatCard — reusable overview stat card
// Matches the existing dashboard home stat card pattern
import PropTypes from 'prop-types'
import styles from './StatCard.module.css'

export default function StatCard({ label, value, sub, icon, tone }) {
  return (
    <div className={`${styles.card} ${tone ? styles[tone] : ''}`}>
      <div className={styles.top}>
        <div className={`${styles.iconWrap} ${tone ? styles[`icon_${tone}`] : ''}`} aria-hidden="true">
          {icon}
        </div>
        {tone === 'alert' && (
          <span className={styles.alertDot} aria-label="Requires attention" />
        )}
      </div>
      <div className={styles.body}>
        <span className={styles.value}>{value}</span>
        <span className={styles.label}>{label}</span>
        {sub && <span className={styles.sub}>{sub}</span>}
      </div>
    </div>
  )
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  sub:   PropTypes.string,
  icon:  PropTypes.node.isRequired,
  tone:  PropTypes.oneOf(['default', 'alert', 'warn', 'success']),
}
