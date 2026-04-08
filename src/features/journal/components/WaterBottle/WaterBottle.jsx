import { memo, useId } from 'react'
import PropTypes from 'prop-types'
import styles from './WaterBottle.module.css'

function WaterBottle({ consumed, goal, progressPct, onQuickAdd, activeQuickMl }) {
  const uid = useId().replace(/:/g, '')
  const clipId = `bottle-clip-${uid}`
  const gradientId = `water-grad-${uid}`
  const pct = goal > 0 ? Math.min(consumed / goal, 1) : 0
  const fillPct = Math.round(pct * 100)
  const INNER_H = 260
  const fillH = INNER_H * pct
  const consumedL = (consumed / 1000).toFixed(1)
  const goalL = (goal / 1000).toFixed(1)
  const isOverGoal = consumed > goal

  return (
    <div className={styles.wrap} aria-label={`Water bottle ${fillPct}% full`}>
      <svg
        viewBox="0 0 160 320"
        className={styles.svg}
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id={clipId}>
            <path d="
              M58 18
              C58 18 48 24 44 36
              L40 64
              C28 68 20 80 20 94
              L20 272
              C20 290 34 304 52 304
              L108 304
              C126 304 140 290 140 272
              L140 94
              C140 80 132 68 120 64
              L116 36
              C112 24 102 18 102 18
              Z
            " />
          </clipPath>

          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a6fa5" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#2a4365" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Bottle outline */}
        <path
          d="
            M58 18
            C58 18 48 24 44 36
            L40 64
            C28 68 20 80 20 94
            L20 272
            C20 290 34 304 52 304
            L108 304
            C126 304 140 290 140 272
            L140 94
            C140 80 132 68 120 64
            L116 36
            C112 24 102 18 102 18
            Z
          "
          fill="#eef4fa"
          stroke="#d0e4f5"
          strokeWidth="2"
        />

        {/* Bottle neck cap */}
        <rect x="60" y="8" width="40" height="16" rx="6"
          fill="#d0e4f5" stroke="#b8d4ed" strokeWidth="1.5" />

        <g clipPath={`url(#${clipId})`}>
          <rect
            x="20"
            y={304 - fillH}
            width="120"
            height={fillH}
            fill={`url(#${gradientId})`}
            className={styles.fill}
            style={{ '--fill-y': `${304 - fillH}px`, '--fill-h': `${fillH}px` }}
          />
          {pct > 0 && pct < 1 && (
            <path
              d={`M20 ${304 - fillH} Q50 ${304 - fillH - 6} 80 ${304 - fillH} Q110 ${304 - fillH + 6} 140 ${304 - fillH}`}
              fill="none"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="2"
              className={styles.wave}
            />
          )}
        </g>

        {/* Horizontal level lines inside bottle */}
        {[0.25, 0.5, 0.75].map((lvl) => (
          <line
            key={lvl}
            x1="32" y1={304 - INNER_H * lvl}
            x2="80" y2={304 - INNER_H * lvl}
            stroke="#c4d9ef" strokeWidth="1" strokeDasharray="4 3"
          />
        ))}
      </svg>

      <div className={styles.stats}>
        <p className={styles.statsLabel}>Today&apos;s Progress</p>
        <div className={styles.statsValue}>
          <span className={`${styles.consumed} ${isOverGoal ? styles.consumedOver : ''}`}>{consumedL}</span>
          <span className={styles.goal}>/ {goalL}L</span>
        </div>

        <div className={styles.barTrack} role="progressbar" aria-valuenow={Math.round(progressPct)} aria-valuemin={0} aria-valuemax={100}>
          <div className={styles.barFill} style={{ width: `${progressPct}%` }} />
        </div>

        <p className={styles.pctLabel}>
          <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" className={styles.checkIcon}>
            <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
          </svg>
          {fillPct}% of your daily goal achieved
        </p>

        <div className={styles.quickRow} aria-label="Quick add hydration">
          {[
            { ml: 250, label: 'Small Glass' },
            { ml: 500, label: 'Medium Bottle' },
          ].map((q) => (
            <button
              key={q.ml}
              type="button"
              onClick={() => onQuickAdd(q.ml)}
              className={`${styles.quickBtn} ${activeQuickMl === q.ml ? styles.quickBtnActive : ''}`}
              aria-label={`Add ${q.ml}ml`}
              aria-pressed={activeQuickMl === q.ml}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={styles.quickIcon}>
                <path d="M5 2h14l-1.5 18H6.5L5 2z" />
              </svg>
              <span className={styles.quickMl}>+{q.ml}ml</span>
              <span className={styles.quickLbl}>{q.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

WaterBottle.propTypes = {
  consumed: PropTypes.number.isRequired,
  goal: PropTypes.number.isRequired,
  progressPct: PropTypes.number.isRequired,
  onQuickAdd: PropTypes.func.isRequired,
  activeQuickMl: PropTypes.number,
}

export default memo(WaterBottle)
