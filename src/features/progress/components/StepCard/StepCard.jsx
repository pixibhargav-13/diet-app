import PropTypes from 'prop-types'
import styles from './StepCard.module.css'

const GOAL = 10000

export default function StepCard({ todaySteps, weeklyAvg, entries }) {
  const pct = Math.min(100, Math.round((todaySteps / GOAL) * 100))
  const last7 = entries.slice(-7)
  const max = Math.max(...last7.map((e) => e.steps), 1)

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <p className={styles.title}>Step Count</p>
          <p className={styles.sub}>Daily goal: {GOAL.toLocaleString()} steps</p>
        </div>
        <div className={styles.badge} data-status={pct >= 100 ? 'done' : pct >= 60 ? 'good' : 'low'}>
          {pct >= 100 ? 'Goal Reached' : `${pct}%`}
        </div>
      </div>

      <div className={styles.main}>
        <span className={styles.count}>{todaySteps.toLocaleString()}</span>
        <span className={styles.unit}>steps today</span>
      </div>

      {/* Ring progress */}
      <div className={styles.ringWrap}>
        <svg viewBox="0 0 80 80" className={styles.ring}>
          <circle cx="40" cy="40" r="34" className={styles.ringBg} />
          <circle
            cx="40" cy="40" r="34"
            className={styles.ringFill}
            strokeDasharray={`${2 * Math.PI * 34}`}
            strokeDashoffset={`${2 * Math.PI * 34 * (1 - pct / 100)}`}
          />
        </svg>
        <span className={styles.ringLabel}>{pct}%</span>
      </div>

      {/* 7-day mini bar chart */}
      <div className={styles.chartSection}>
        <p className={styles.chartTitle}>Last 7 days</p>
        <div className={styles.bars}>
          {last7.map((e) => (
            <div key={e.date} className={styles.barCol}>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{ height: `${Math.round((e.steps / max) * 100)}%` }}
                />
              </div>
              <span className={styles.barLabel}>{new Date(e.date + 'T12:00').toLocaleDateString('en', { weekday: 'narrow' })}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.stat}>
          <span className={styles.statVal}>{weeklyAvg.toLocaleString()}</span>
          <span className={styles.statLabel}>Weekly avg</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statVal}>{GOAL.toLocaleString()}</span>
          <span className={styles.statLabel}>Daily goal</span>
        </div>
      </div>
    </div>
  )
}

StepCard.propTypes = {
  todaySteps: PropTypes.number.isRequired,
  weeklyAvg: PropTypes.number.isRequired,
  entries: PropTypes.arrayOf(PropTypes.shape({ date: PropTypes.string, steps: PropTypes.number })).isRequired,
}
