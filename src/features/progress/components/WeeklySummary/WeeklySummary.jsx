import PropTypes from 'prop-types'
import styles from './WeeklySummary.module.css'

export default function WeeklySummary({ weightChange, avgSteps, measurementDelta, measurementType }) {
  const weightTrend = weightChange < 0 ? 'down' : weightChange > 0 ? 'up' : 'neutral'
  const stepGoalMet = avgSteps >= 10000

  const insights = [
    weightChange !== 0 && {
      icon: weightTrend === 'down' ? '↓' : '↑',
      tone: weightTrend === 'down' ? 'good' : 'warn',
      text: `Weight ${weightTrend === 'down' ? 'decreased' : 'increased'} by ${Math.abs(weightChange).toFixed(1)} kg this week`,
    },
    {
      icon: '👟',
      tone: stepGoalMet ? 'good' : 'warn',
      text: stepGoalMet
        ? `Great job! Averaged ${avgSteps.toLocaleString()} steps/day this week`
        : `Averaged ${avgSteps.toLocaleString()} steps/day — aim for 10,000`,
    },
    measurementDelta !== 0 && {
      icon: '📏',
      tone: 'neutral',
      text: `${measurementType} changed by ${measurementDelta > 0 ? '+' : ''}${measurementDelta} cm this week`,
    },
  ].filter(Boolean)

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" className={styles.icon}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <p className={styles.title}>Weekly Summary</p>
        </div>
        <span className={styles.period}>Last 7 days</span>
      </div>

      <div className={styles.insights}>
        {insights.map((ins, i) => (
          <div key={i} className={`${styles.insight} ${styles[ins.tone]}`}>
            <span className={styles.insightIcon}>{ins.icon}</span>
            <span className={styles.insightText}>{ins.text}</span>
          </div>
        ))}
        {insights.length === 0 && (
          <p className={styles.empty}>Log entries to see your weekly summary.</p>
        )}
      </div>
    </div>
  )
}

WeeklySummary.propTypes = {
  weightChange: PropTypes.number,
  avgSteps: PropTypes.number,
  measurementDelta: PropTypes.number,
  measurementType: PropTypes.string,
}

WeeklySummary.defaultProps = {
  weightChange: 0,
  avgSteps: 0,
  measurementDelta: 0,
  measurementType: 'Measurement',
}
