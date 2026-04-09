import { useCallback, useMemo, useState } from 'react'
import { useHydrationStore } from '../../../store/useHydrationStore'
import useHydrationDaySync from '../../../hooks/useHydrationDaySync'
import WaterBottle from '../components/WaterBottle/WaterBottle'
import HydrationLog from '../components/HydrationLog/HydrationLog'
import HealthInsightBar from '../components/HealthInsightBar/HealthInsightBar'
import styles from './WaterIntakePage.module.css'

const INSIGHT_STATS = [
  { label: 'Weekly Streak', value: '5 Days' },
  { label: 'Consistency', value: '92%' },
]

export default function WaterIntakePage() {
  useHydrationDaySync()

  const entries = useHydrationStore((state) => state.entriesByDate[state.dateKey] ?? [])
  const goalMl = useHydrationStore((state) => state.goalMl)
  const addEntry = useHydrationStore((state) => state.addEntry)
  const subtractEntry = useHydrationStore((state) => state.subtractEntry)
  const setGoalMl = useHydrationStore((state) => state.setGoalMl)

  const [goalDraft, setGoalDraft] = useState(String(goalMl))
  const [goalEditorOpen, setGoalEditorOpen] = useState(false)
  const [goalError, setGoalError] = useState('')
  const [activeQuickMl, setActiveQuickMl] = useState(null)

  const consumed = useMemo(
    () => entries.reduce((sum, entry) => sum + entry.ml, 0),
    [entries]
  )
  const progressPct = useMemo(() => {
    if (!goalMl) return 0
    return Math.min((consumed / goalMl) * 100, 100)
  }, [consumed, goalMl])

  const handleQuickAdd = useCallback((ml) => {
    addEntry(ml, 'Water Bottle')
    setActiveQuickMl(ml)
  }, [addEntry])

  const handleCustomAdd = useCallback((ml) => {
    addEntry(ml, 'Custom Volume')
    setActiveQuickMl(null)
  }, [addEntry])

  const handleQuickRemove = useCallback((ml) => {
    subtractEntry(ml, 'Water Bottle')
    setActiveQuickMl(null)
  }, [subtractEntry])

  const handleGoalOpen = useCallback(() => {
    setGoalDraft(String(goalMl))
    setGoalError('')
    setGoalEditorOpen(true)
  }, [goalMl])

  const handleGoalSave = useCallback(() => {
    const parsed = Number(goalDraft)
    if (!Number.isFinite(parsed) || parsed < 250) {
      setGoalError('Enter a goal of at least 250ml')
      return
    }

    setGoalMl(parsed)
    setGoalError('')
    setGoalEditorOpen(false)
  }, [goalDraft, setGoalMl])

  const handleGoalCancel = useCallback(() => {
    setGoalEditorOpen(false)
    setGoalError('')
    setGoalDraft(String(goalMl))
  }, [goalMl])

  return (
    <div className={styles.page}>

      <header className={styles.pageHeader}>
        <div className={styles.headerCopy}>
          <h1 className={styles.heading}>Water Intake</h1>
        </div>
        <button type="button" className={styles.adjustBtn} onClick={handleGoalOpen}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
          </svg>
          Adjust Daily Goal
        </button>
      </header>

      {goalEditorOpen ? (
        <section className={styles.goalEditor} aria-label="Adjust daily water goal">
          <div className={styles.goalEditorField}>
            <label htmlFor="daily-goal" className={styles.goalLabel}>Daily goal in ml</label>
            <input
              id="daily-goal"
              type="number"
              min="250"
              step="50"
              value={goalDraft}
              onChange={(e) => {
                setGoalDraft(e.target.value)
                setGoalError('')
              }}
              className={styles.goalInput}
            />
          </div>
          <div className={styles.goalActions}>
            <button type="button" className={styles.goalSaveBtn} onClick={handleGoalSave}>
              Save Goal
            </button>
            <button type="button" className={styles.goalCancelBtn} onClick={handleGoalCancel}>
              Cancel
            </button>
          </div>
          {goalError ? <p className={styles.goalError} role="alert">{goalError}</p> : null}
        </section>
      ) : null}

      <div className={styles.layout}>
        <div className={styles.bottleCard}>
          <WaterBottle
            consumed={consumed}
            goal={goalMl}
            progressPct={progressPct}
            onQuickAdd={handleQuickAdd}
            onQuickRemove={handleQuickRemove}
            activeQuickMl={activeQuickMl}
          />
        </div>

        <HydrationLog entries={entries} onAddCustom={handleCustomAdd} />

      </div>

      <HealthInsightBar
        tip="Drinking water in the morning can increase your alertness and metabolic rate for the next 60 minutes."
        stats={INSIGHT_STATS}
      />

    </div>
  )
}
