import { useCallback, useMemo, useRef, useState } from 'react'

const today = new Date()
const fmt = (d) => d.toISOString().split('T')[0]
const daysAgo = (n) => { const d = new Date(today); d.setDate(d.getDate() - n); return d }

const MOCK_WEEKLY = {
  consistency: 71,        // % days logged
  avgCalories: 1820,
  targetCalories: 2000,
  weightChange: -0.6,
  badges: ['7-Day Streak 🔥', 'Water Goal Hit 💧', 'Steps Target 👟'],
  dietitianNotes: 'Great consistency this week! Consider adding more fibre-rich foods at lunch. Your hydration has improved significantly — keep it up.',
}

const MOCK_MONTHLY = {
  consistency: 83,
  avgCalories: 1890,
  targetCalories: 2000,
  weightChange: -2.1,
  badges: ['Monthly Goal 🎯', '30-Day Streak 🔥', 'Best Month Yet ⭐'],
  dietitianNotes: 'Excellent month overall. Your weight loss is steady and sustainable. We can adjust your macros slightly for next month to target more muscle retention.',
}

export function useWeeklySummary() {
  const [period, setPeriod] = useState('week')
  const [startDate, setStartDate] = useState(fmt(daysAgo(6)))
  const [endDate, setEndDate] = useState(fmt(today))
  const [copied, setCopied] = useState(false)
  const copiedTimerRef = useRef(null)

  const data = useMemo(
    () => (period === 'week' ? MOCK_WEEKLY : MOCK_MONTHLY),
    [period],
  )
  const loading = false

  const switchPeriod = useCallback((p) => {
    setPeriod(p)
    if (p === 'week') {
      setStartDate(fmt(daysAgo(6)))
      setEndDate(fmt(today))
    } else {
      setStartDate(fmt(daysAgo(29)))
      setEndDate(fmt(today))
    }
  }, [])

  const shareSummary = useCallback(async () => {
    const text = [
      `${period === 'week' ? 'Weekly' : 'Monthly'} Health Summary`,
      `${startDate} -> ${endDate}`,
      `Consistency: ${data.consistency}%`,
      `Avg Calories: ${data.avgCalories} / ${data.targetCalories} kcal`,
      `Weight Change: ${data.weightChange > 0 ? '+' : ''}${data.weightChange} kg`,
      `Achievements: ${data.badges.join(', ')}`,
    ].join('\n')

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      if (copiedTimerRef.current) {
        clearTimeout(copiedTimerRef.current)
      }
      copiedTimerRef.current = setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }, [period, startDate, endDate, data])

  return {
    period,
    switchPeriod,
    startDate, setStartDate,
    endDate, setEndDate,
    data,
    loading,
    copied,
    shareSummary,
  }
}