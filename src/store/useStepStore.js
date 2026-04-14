import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const today = new Date()
const fmt = (d) => d.toISOString().split('T')[0]
const daysAgo = (n) => { const d = new Date(today); d.setDate(d.getDate() - n); return d }

// Mock seed data — 14 days
const SEED = Array.from({ length: 14 }, (_, i) => ({
  date: fmt(daysAgo(13 - i)),
  steps: 4000 + Math.floor(Math.sin(i + 1) * 2000 + Math.random() * 3000),
}))

export const useStepStore = create(
  persist(
    (set, get) => ({
      entries: SEED,

      addEntry: (date, steps) => {
        set((s) => {
          const existing = s.entries.findIndex((e) => e.date === date)
          if (existing >= 0) {
            const updated = [...s.entries]
            updated[existing] = { date, steps }
            return { entries: updated }
          }
          return { entries: [...s.entries, { date, steps }].sort((a, b) => a.date.localeCompare(b.date)) }
        })
      },

      getTodaySteps: () => {
        const todayStr = fmt(new Date())
        return get().entries.find((e) => e.date === todayStr)?.steps ?? 0
      },

      getWeeklyAvg: () => {
        const last7 = get().entries.slice(-7)
        if (!last7.length) return 0
        return Math.round(last7.reduce((s, e) => s + e.steps, 0) / last7.length)
      },

      getWeeklyTotal: () => {
        return get().entries.slice(-7).reduce((s, e) => s + e.steps, 0)
      },
    }),
    {
      name: 'vitals-steps',
      partialize: (s) => ({ entries: s.entries }),
    }
  )
)
