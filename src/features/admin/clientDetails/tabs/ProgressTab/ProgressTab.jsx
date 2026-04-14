// ProgressTab — weight trend + measurement charts using Recharts AreaChart
// Uses gradient area fill + ReferenceLine for target weight (from Context7 docs)
import { useState } from 'react'
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer
} from 'recharts'
import styles from './ProgressTab.module.css'

const WEIGHT_DATA = [
  { date: 'Oct 1',  weight: 84.2 },
  { date: 'Oct 8',  weight: 83.5 },
  { date: 'Oct 15', weight: 82.8 },
  { date: 'Oct 22', weight: 82.1 },
  { date: 'Oct 29', weight: 81.6 },
  { date: 'Nov 5',  weight: 80.9 },
  { date: 'Nov 12', weight: 80.2 },
]

const MEASUREMENT_SETS = {
  Waist: [
    { date: 'Oct 1',  value: 88 },
    { date: 'Oct 15', value: 86.5 },
    { date: 'Oct 29', value: 85 },
    { date: 'Nov 12', value: 83.8 },
  ],
  'Hip': [
    { date: 'Oct 1',  value: 102 },
    { date: 'Oct 15', value: 101 },
    { date: 'Oct 29', value: 100 },
    { date: 'Nov 12', value: 99.2 },
  ],
  'Chest': [
    { date: 'Oct 1',  value: 94 },
    { date: 'Oct 15', value: 93.5 },
    { date: 'Oct 29', value: 93 },
    { date: 'Nov 12', value: 92.5 },
  ],
}

const CustomTooltip = ({ active, payload, label, unit }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipLabel}>{label}</p>
        <p className={styles.tooltipVal}>{payload[0].value} {unit}</p>
      </div>
    )
  }
  return null
}

export default function ProgressTab({ targetWeight = 72 }) {
  const [activeMeasure, setActiveMeasure] = useState('Waist')

  const latestWeight    = WEIGHT_DATA[WEIGHT_DATA.length - 1].weight
  const startWeight     = WEIGHT_DATA[0].weight
  const weightLost      = (startWeight - latestWeight).toFixed(1)
  const toTarget        = (latestWeight - targetWeight).toFixed(1)

  return (
    <div className={styles.wrap}>

      {/* ── Weight chart ── */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <div>
            <p className={styles.chartLabel}>Weight Trend</p>
            <div className={styles.chartStats}>
              <div className={styles.chartStat}>
                <span className={styles.statVal}>{latestWeight} kg</span>
                <span className={styles.statLbl}>Current</span>
              </div>
              <div className={styles.chartStat}>
                <span className={styles.statVal} style={{ color: '#4a7c59' }}>-{weightLost} kg</span>
                <span className={styles.statLbl}>Lost</span>
              </div>
              <div className={styles.chartStat}>
                <span className={styles.statVal}>{targetWeight} kg</span>
                <span className={styles.statLbl}>Target</span>
              </div>
              <div className={styles.chartStat}>
                <span className={styles.statVal} style={{ color: '#d4a72c' }}>{toTarget} kg</span>
                <span className={styles.statLbl}>To Goal</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.chartArea}>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={WEIGHT_DATA} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2a4365" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#2a4365" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis
                domain={[targetWeight - 2, startWeight + 1]}
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false} tickLine={false}
                tickFormatter={(v) => `${v}`}
              />
              <Tooltip content={<CustomTooltip unit="kg" />} cursor={{ stroke: '#2a4365', strokeWidth: 1, strokeDasharray: '4 2' }} />
              {/* Target weight reference line */}
              <ReferenceLine
                y={targetWeight}
                stroke="#d4a72c"
                strokeDasharray="5 3"
                strokeWidth={1.5}
                label={{ value: 'Goal', position: 'right', fontSize: 10, fill: '#d4a72c' }}
              />
              <Area
                type="monotone" dataKey="weight"
                stroke="#2a4365" strokeWidth={2.5}
                fill="url(#weightGrad)"
                dot={{ r: 4, fill: '#2a4365', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#2a4365' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Measurements chart ── */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <p className={styles.chartLabel}>Body Measurements</p>
          <div className={styles.measureTabs}>
            {Object.keys(MEASUREMENT_SETS).map((m) => (
              <button key={m} type="button"
                onClick={() => setActiveMeasure(m)}
                className={`${styles.measureTab} ${activeMeasure === m ? styles.measureTabActive : ''}`}
                aria-pressed={activeMeasure === m}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.chartArea}>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={MEASUREMENT_SETS[activeMeasure]} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip unit="cm" />} cursor={{ stroke: '#4a6fa5', strokeWidth: 1, strokeDasharray: '4 2' }} />
              <Line
                type="monotone" dataKey="value"
                stroke="#4a6fa5" strokeWidth={2.5}
                dot={{ r: 4, fill: '#4a6fa5', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#4a6fa5' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Stat strip */}
        <div className={styles.measureStats}>
          {(() => {
            const d = MEASUREMENT_SETS[activeMeasure]
            const diff = (d[0].value - d[d.length-1].value).toFixed(1)
            return (
              <>
                <div className={styles.mStat}><span className={styles.mStatV}>{d[0].value} cm</span><span className={styles.mStatL}>Start</span></div>
                <div className={styles.mStat}><span className={styles.mStatV}>{d[d.length-1].value} cm</span><span className={styles.mStatL}>Current</span></div>
                <div className={styles.mStat}><span className={styles.mStatV} style={{ color: '#4a7c59' }}>-{diff} cm</span><span className={styles.mStatL}>Reduced</span></div>
              </>
            )
          })()}
        </div>
      </div>

    </div>
  )
}
