import { memo, useMemo } from 'react'
import PropTypes from 'prop-types'
import styles from './SummaryCard.module.css'

function Block({ label, value, sub, tone }) {
    return (
        <div className={styles.block}>
            <span className={styles.blockLabel}>{label}</span>
            <span className={`${styles.blockValue} ${tone ? styles[tone] : ''}`}>{value}</span>
            {sub ? <span className={styles.blockSub}>{sub}</span> : null}
        </div>
    )
}

Block.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.node.isRequired,
    sub: PropTypes.string,
    tone: PropTypes.oneOf(['good', 'warn', 'danger']),
}

export const SummaryCard = memo(function SummaryCard({
    weightStats,
    goalWeight,
    measurementLatest,
    measurementType,
    measurementDelta,
}) {
    const { start, current, change, goalGap } = weightStats

    const summaryBlocks = useMemo(() => {
        const changeTone = change < 0 ? 'good' : change > 0 ? 'danger' : undefined
        const changeLabel =
            change === 0 ? '—' : `${change < 0 ? '↓' : '↑'} ${Math.abs(change)} kg`

        const goalGapTone = goalGap <= 0 ? 'good' : goalGap < 3 ? 'warn' : undefined
        const goalGapLabel = goalGap <= 0 ? 'Reached' : `${goalGap} kg left`

        const measurementTone =
            measurementDelta < 0 ? 'good' : measurementDelta > 0 ? 'danger' : undefined
        const measurementChangeLabel =
            measurementDelta === 0
                ? 'No change'
                : `${measurementDelta < 0 ? '↓' : '↑'} ${Math.abs(measurementDelta)} cm`

        return [
            { label: 'Starting Weight', value: `${start} kg`, sub: 'When you began' },
            { label: 'Current Weight', value: `${current} kg`, sub: 'Latest entry' },
            {
                label: 'Weight Change',
                value: changeLabel,
                sub: 'Since first entry',
                tone: changeTone,
            },
            { label: 'Goal Weight', value: `${goalWeight} kg`, sub: 'Your target' },
            {
                label: 'Goal Gap',
                value: goalGapLabel,
                sub: goalGap <= 0 ? 'Well done!' : 'Remaining',
                tone: goalGapTone,
            },
            {
                label: `${measurementType} (latest)`,
                value: measurementLatest ? `${measurementLatest.value} cm` : '—',
                sub: measurementChangeLabel,
                tone: measurementTone,
            },
        ]
    }, [
        start,
        current,
        change,
        goalGap,
        goalWeight,
        measurementType,
        measurementLatest,
        measurementDelta,
    ])

    return (
        <section className={styles.card} aria-label="Progress summary">
            <h2 className={styles.title}>Summary</h2>
            <div className={styles.grid}>
                {summaryBlocks.map((block) => (
                    <Block
                        key={block.label}
                        label={block.label}
                        value={block.value}
                        sub={block.sub}
                        tone={block.tone}
                    />
                ))}
            </div>
        </section>
    )
})

SummaryCard.displayName = 'SummaryCard'

SummaryCard.propTypes = {
    weightStats: PropTypes.shape({
        start: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        current: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        change: PropTypes.number.isRequired,
        goalGap: PropTypes.number.isRequired,
    }).isRequired,
    goalWeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    measurementLatest: PropTypes.shape({
        value: PropTypes.number,
    }),
    measurementType: PropTypes.string.isRequired,
    measurementDelta: PropTypes.number.isRequired,
}