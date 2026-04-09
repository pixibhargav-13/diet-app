import { useCallback, useMemo, useState } from 'react'

const today = new Date()
const fmt = (d) => d.toISOString().split('T')[0]
const daysAgo = (n) => { const d = new Date(today); d.setDate(d.getDate() - n); return d }

// Stable mock data (generated once so values don't shift on re-render)
function genData(days, baseWeight, drift) {
  return Array.from({ length: days }, (_, i) => ({
    date: fmt(daysAgo(days - 1 - i)),
    weight: +(baseWeight + drift * i + (Math.sin(i) * 0.2)).toFixed(1),
  }))
}

const MOCK = {
  daily: genData(30, 80.2, -0.04),
  weekly: genData(12, 82.0, -0.22),
  monthly: genData(6, 84.0, -0.55),
}

export function useWeightTrend() {
  const [groupBy, setGroupBy] = useState('daily')
  const [goalWeight, setGoalWeight] = useState('75')
  const [editingGoal, setEditingGoal] = useState(false)
  const [dataByGroup, setDataByGroup] = useState(MOCK)
  const [entries, setEntries] = useState(MOCK.daily)

  const data = dataByGroup[groupBy]
  const loading = false

  const addEntry = useCallback((entry) => {
    setDataByGroup((prev) => {
      const nextGroup = [...prev[groupBy], entry].sort((a, b) => a.date.localeCompare(b.date))
      return { ...prev, [groupBy]: nextGroup }
    })
    setEntries((prev) => [entry, ...prev])
  }, [groupBy])

  const stats = useMemo(() => {
    const start = data[0]?.weight
    const current = data[data.length - 1]?.weight

    return {
      start: start ?? '—',
      current: current ?? '—',
      change:
        data.length > 1
          ? +((data[data.length - 1].weight - data[0].weight).toFixed(1))
          : 0,
      goalGap: data.length ? +((data[data.length - 1].weight - +goalWeight).toFixed(1)) : 0,
    }
  }, [data, goalWeight])

  const exportCsv = useCallback(() => {
    const csv = ['date,weight', ...data.map((d) => `${d.date},${d.weight}`)].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `weight-${groupBy}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [data, groupBy])

  return {
    groupBy, setGroupBy,
    goalWeight, setGoalWeight,
    editingGoal, setEditingGoal,
    data, loading, stats,
    entries,
    addEntry,
    exportCsv,
  }
}