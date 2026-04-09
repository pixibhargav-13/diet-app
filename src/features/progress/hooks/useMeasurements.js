import { useCallback, useMemo, useState } from 'react'

const TYPES = ['Waist', 'Hips', 'Chest', 'Arms', 'Thighs']

const today = new Date()
const fmt = (d) => d.toISOString().split('T')[0]
const wksAgo = (n) => { const d = new Date(today); d.setDate(d.getDate() - n * 7); return d }

// Stable mock data per type (generated once)
const BASE = { Waist: 84, Hips: 97, Chest: 90, Arms: 34, Thighs: 59 }
const DRIFT = { Waist: -0.18, Hips: -0.12, Chest: -0.09, Arms: 0.06, Thighs: -0.14 }

function genData(type) {
  return Array.from({ length: 10 }, (_, i) => ({
    date: fmt(wksAgo(9 - i)),
    value: +(BASE[type] + DRIFT[type] * i + Math.sin(i) * 0.15).toFixed(1),
  }))
}

const ALL_DATA = Object.fromEntries(TYPES.map((t) => [t, genData(t)]))

export function useMeasurements() {
  const [selectedType, setSelectedType] = useState('Waist')
  const [dataMap, setDataMap] = useState(ALL_DATA)

  const chartData = dataMap[selectedType] ?? []

  const first = useMemo(() => chartData[0], [chartData])
  const latest = useMemo(() => chartData[chartData.length - 1], [chartData])
  const delta = useMemo(
    () => (first && latest ? +(latest.value - first.value).toFixed(1) : 0),
    [first, latest],
  )

  const addEntry = useCallback((type, entry) => {
    if (!TYPES.includes(type)) return

    setDataMap((prev) => ({
      ...prev,
      [type]: [...(prev[type] ?? []), entry].sort((a, b) => a.date.localeCompare(b.date)),
    }))
  }, [])

  return {
    types: TYPES,
    selectedType,
    setSelectedType,
    chartData,
    latest,
    first,
    delta,
    addEntry,
  }
}