import { memo, useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import styles from './WeightChart.module.css'

const GROUPS = ['daily', 'weekly', 'monthly']
const GROUP_LABELS = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
}

function DeltaChip({ value }) {
  if (value === 0) return <span className={styles.chipNeutral}>No change</span>

  return value < 0 ? (
    <span className={styles.chipGood}>↓ {Math.abs(value)} kg</span>
  ) : (
    <span className={styles.chipBad}>↑ {value} kg</span>
  )
}

DeltaChip.propTypes = { value: PropTypes.number.isRequired }

function WeightTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      <p className={styles.tooltipValue}>{payload[0].value} kg</p>
    </div>
  )
}

WeightTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export const WeightChart = memo(function WeightChart({
  data,
  loading,
  stats,
  groupBy,
  onGroupChange,
  goalWeight,
  onGoalWeightChange,
  editingGoal,
  onEditingGoalChange,
  onExport,
}) {
  const goalWeightValue = useMemo(() => Number(goalWeight) || 0, [goalWeight])

  const statItems = useMemo(
    () => [
      { label: 'Start', value: `${stats.start} kg` },
      { label: 'Current', value: `${stats.current} kg` },
      { label: 'Change', value: <DeltaChip value={stats.change} /> },
      {
        label: 'Goal gap',
        value:
          stats.goalGap >= 0
            ? `${stats.goalGap} kg left`
            : `${Math.abs(stats.goalGap)} kg over`,
      },
    ],
    [stats],
  )

  const hasData = data.length > 0

  return (
    <section className={styles.section} aria-label="Weight trend chart">
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Weight Trend</h2>
        <button
          type="button"
          onClick={onExport}
          className={styles.exportBtn}
          aria-label="Export weight data as CSV"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export
        </button>
      </div>

      <div className={styles.controls}>
        <div className={styles.groupToggle} role="group" aria-label="Chart time period">
          {GROUPS.map((group) => (
            <button
              key={group}
              type="button"
              onClick={() => onGroupChange(group)}
              className={`${styles.groupBtn} ${groupBy === group ? styles.groupBtnActive : ''}`}
              aria-pressed={groupBy === group}
            >
              {GROUP_LABELS[group]}
            </button>
          ))}
        </div>

        <div className={styles.goalWrap}>
          <span className={styles.goalLabel}>Goal:</span>
          {editingGoal ? (
            <div className={styles.goalEdit}>
              <input
                type="number"
                step="0.5"
                value={goalWeight}
                onChange={(e) => onGoalWeightChange(e.target.value)}
                className={styles.goalInput}
                aria-label="Goal weight in kg"
                autoFocus
              />
              <span className={styles.goalUnit}>kg</span>
              <button
                type="button"
                onClick={() => onEditingGoalChange(false)}
                className={styles.goalDone}
              >
                ✓
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onEditingGoalChange(true)}
              className={styles.goalBtn}
              aria-label="Edit goal weight"
            >
              {goalWeight} kg
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className={styles.chartArea}>
        {loading ? (
          <div className={styles.loading} aria-live="polite" aria-busy="true">Loading…</div>
        ) : !hasData ? (
          <div className={styles.loading} aria-live="polite">No weight entries yet.</div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickFormatter={(d) => d.slice(5)}
                interval="preserveStartEnd"
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                hide
                domain={['auto', 'auto']}
              />
              <Tooltip content={<WeightTooltip />} cursor={false} trigger="click" />
              {goalWeightValue > 0 ? (
                <ReferenceLine
                  y={goalWeightValue}
                  stroke="#d4a72c"
                  strokeDasharray="5 4"
                  strokeWidth={1.5}
                />
              ) : null}
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#2a4365"
                strokeWidth={2.5}
                isAnimationActive={false}
                animationDuration={0}
                dot={{ fill: '#2a4365', r: 3, strokeWidth: 0 }}
                activeDot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className={styles.statsStrip} role="list" aria-label="Weight statistics">
        {statItems.map((item) => (
          <div key={item.label} className={styles.statItem} role="listitem">
            <span className={styles.statLabel}>{item.label}</span>
            <span className={styles.statValue}>{item.value}</span>
          </div>
        ))}
      </div>
    </section>
  )
})

WeightChart.displayName = 'WeightChart'

WeightChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      weight: PropTypes.number.isRequired,
    }),
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  stats: PropTypes.shape({
    start: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    current: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    change: PropTypes.number.isRequired,
    goalGap: PropTypes.number.isRequired,
  }).isRequired,
  groupBy: PropTypes.string.isRequired,
  onGroupChange: PropTypes.func.isRequired,
  goalWeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onGoalWeightChange: PropTypes.func.isRequired,
  editingGoal: PropTypes.bool.isRequired,
  onEditingGoalChange: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
}