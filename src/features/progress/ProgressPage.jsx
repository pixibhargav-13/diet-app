// ProgressPage — /dashboard/progress
// Weight + Measurement charts side by side, SummaryCard full-width below
import { useCallback, useState } from 'react'
import { useWeightTrend } from './hooks/useWeightTrend'
import { useMeasurements } from './hooks/useMeasurements'
import { WeightChart } from './components/WeightChart/WeightChart'
import { MeasurementChart } from './components/MeasurementChart/MeasurementChart'
import { SummaryCard } from './components/SummaryCard/SummaryCard'
import { LogModal } from './components/LogModal/LogModal'
import { toastSaved } from '../../utils/Toast'
import styles from './ProgressPage.module.css'

function lbsToKg(lbs) {
  return +(lbs / 2.20462).toFixed(1)
}

function normalizeWeight(weight, unit) {
  if (!Number.isFinite(weight)) return null
  return unit === 'lbs' ? lbsToKg(weight) : weight
}

export default function ProgressPage() {
  const [modalOpen, setModalOpen] = useState(false)

  const {
    data, loading, stats,
    groupBy, setGroupBy,
    goalWeight, setGoalWeight,
    editingGoal, setEditingGoal,
    addEntry: addWeightEntry,
    exportCsv,
  } = useWeightTrend()

  const {
    types, selectedType, setSelectedType,
    chartData, latest, first, delta,
    addEntry: addMeasureEntry,
  } = useMeasurements()

  const handleOpenModal = useCallback(() => {
    setModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setModalOpen(false)
  }, [])

  const handleSave = useCallback((entry) => {
    if (Number.isFinite(entry.weight)) {
      const normalizedWeight = normalizeWeight(entry.weight, entry.unit)
      if (normalizedWeight !== null) {
        addWeightEntry({ date: entry.date, weight: normalizedWeight })
      }
    }

    Object.entries(entry.measures ?? {}).forEach(([key, val]) => {
      const numericValue = Number(val)
      if (Number.isFinite(numericValue) && numericValue > 0) {
        const type = key.charAt(0).toUpperCase() + key.slice(1)
        addMeasureEntry(type, { date: entry.date, value: numericValue })
      }
    })

    toastSaved()
  }, [addMeasureEntry, addWeightEntry])

  return (
    <div className={styles.page}>

      {/* Page heading */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.heading}>Progress</h1>
          <p className={styles.subtext}>Track your weight, measurements and trends.</p>
        </div>
        <button type="button" onClick={handleOpenModal} className={styles.addBtnDesktop}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Log Entry
        </button>
      </div>

      {/* Charts — side by side on desktop, stacked on mobile */}
      <div className={styles.chartsGrid}>
        <WeightChart
          data={data}
          loading={loading}
          stats={stats}
          groupBy={groupBy}
          onGroupChange={setGroupBy}
          goalWeight={goalWeight}
          onGoalWeightChange={setGoalWeight}
          editingGoal={editingGoal}
          onEditingGoalChange={setEditingGoal}
          onExport={exportCsv}
        />
        <MeasurementChart
          types={types}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          chartData={chartData}
          latest={latest}
          first={first}
          delta={delta}
        />
      </div>

      {/* Summary — full width, spans both columns */}
      <SummaryCard
        weightStats={stats}
        goalWeight={goalWeight}
        measurementLatest={latest}
        measurementType={selectedType}
        measurementDelta={delta}
      />

      {/* FAB — mobile only */}
      <button type="button" onClick={handleOpenModal} className={styles.fab} aria-label="Log new entry">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      <LogModal isOpen={modalOpen} onClose={handleCloseModal} onSave={handleSave} />
    </div>
  )
}