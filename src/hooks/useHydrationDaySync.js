import { useEffect } from 'react'
import { useHydrationStore } from '../store/useHydrationStore'

function getNextMidnightDelay() {
    const now = new Date()
    const next = new Date(now)
    next.setHours(24, 0, 0, 0)
    return next.getTime() - now.getTime()
}

export default function useHydrationDaySync() {
    const ensureToday = useHydrationStore((state) => state.ensureToday)

    useEffect(() => {
        let timeoutId

        const scheduleNextReset = () => {
            timeoutId = window.setTimeout(() => {
                ensureToday()
                scheduleNextReset()
            }, getNextMidnightDelay())
        }

        ensureToday()
        scheduleNextReset()

        return () => {
            window.clearTimeout(timeoutId)
        }
    }, [ensureToday])
}
