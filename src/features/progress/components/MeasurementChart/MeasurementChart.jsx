import { memo, useMemo } from 'react'
import PropTypes from 'prop-types'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
import styles from './MeasurementChart.module.css'

function DeltaChip({ value }) {
    if (value === 0) return <span className={styles.chipNeutral}>No change</span>

    return value < 0 ? (
        <span className={styles.chipGood}>↓ {Math.abs(value)} cm</span>
    ) : (
        <span className={styles.chipBad}>↑ {value} cm</span>
    )
}

DeltaChip.propTypes = { value: PropTypes.number.isRequired }

const TYPE_COLORS = {
    Waist: '#4a6fa5',
    Hips: '#7faad6',
    Chest: '#2a4365',
    Arms: '#d4a72c',
    Thighs: '#4a7c59',
}

const TYPE_PILL_CLASSNAMES = {
    Waist: styles.typePillWaist,
    Hips: styles.typePillHips,
    Chest: styles.typePillChest,
    Arms: styles.typePillArms,
    Thighs: styles.typePillThighs,
}

function MeasurementTooltip({ active, payload, label, selectedType }) {
    if (!active || !payload?.length) return null

    return (
        <div className={styles.tooltip}>
            <p className={styles.tooltipLabel}>{label}</p>
            <p className={styles.tooltipValue}>
                {selectedType}: {payload[0].value} cm
            </p>
        </div>
    )
}

MeasurementTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.array,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    selectedType: PropTypes.string.isRequired,
}

export const MeasurementChart = memo(function MeasurementChart({
    types,
    selectedType,
    onTypeChange,
    chartData,
    latest,
    first,
    delta,
}) {
    const color = useMemo(() => TYPE_COLORS[selectedType] ?? '#4a6fa5', [selectedType])

    return (
        <section className={styles.section} aria-label="Body measurement chart">
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Measurements</h2>
                {latest ? (
                    <span className={styles.latestBadge}>
                        Latest: <strong>{latest.value} cm</strong>
                    </span>
                ) : null}
            </div>

            <div className={styles.typeRow} role="group" aria-label="Select measurement type">
                {types.map((type) => {
                    const isActive = selectedType === type
                    const colorClass = TYPE_PILL_CLASSNAMES[type] ?? ''

                    return (
                        <button
                            key={type}
                            type="button"
                            onClick={() => onTypeChange(type)}
                            className={`${styles.typePill} ${isActive ? `${styles.typePillActive} ${colorClass}` : ''}`}
                            aria-pressed={isActive}
                        >
                            {type}
                        </button>
                    )
                })}
            </div>

            <div className={styles.chartArea}>
                <ResponsiveContainer width="100%" height={210}>
                    <LineChart data={chartData} margin={{ top: 6, right: 10, left: -22, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 10, fill: '#9ca3af' }}
                            tickFormatter={(d) => d.slice(5)}
                            interval="preserveStartEnd"
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis hide domain={['auto', 'auto']} />
                        <Tooltip
                            content={<MeasurementTooltip selectedType={selectedType} />}
                            cursor={false}
                            trigger="click"
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            strokeWidth={2.5}
                            isAnimationActive={false}
                            animationDuration={0}
                            dot={{ fill: color, r: 3, strokeWidth: 0 }}
                            activeDot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className={styles.statsStrip}>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>First</span>
                    <span className={styles.statValue}>{first?.value ?? '—'} cm</span>
                    <span className={styles.statDate}>{first?.date ?? ''}</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Latest</span>
                    <span className={styles.statValue}>{latest?.value ?? '—'} cm</span>
                    <span className={styles.statDate}>{latest?.date ?? ''}</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Change</span>
                    <span className={styles.statValue}><DeltaChip value={delta} /></span>
                </div>
            </div>
        </section>
    )
})

MeasurementChart.displayName = 'MeasurementChart'

MeasurementChart.propTypes = {
    types: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedType: PropTypes.string.isRequired,
    onTypeChange: PropTypes.func.isRequired,
    chartData: PropTypes.arrayOf(
        PropTypes.shape({
            date: PropTypes.string.isRequired,
            value: PropTypes.number.isRequired,
        }),
    ).isRequired,
    latest: PropTypes.shape({
        value: PropTypes.number,
        date: PropTypes.string,
    }),
    first: PropTypes.shape({
        value: PropTypes.number,
        date: PropTypes.string,
    }),
    delta: PropTypes.number.isRequired,
}