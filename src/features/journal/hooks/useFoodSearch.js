// useFoodSearch — debounced food search with request cancellation.
//
// Usage:
//   const { query, setQuery, results, loading, error, provider } = useFoodSearch()
//
// Behaviour:
//   • Debounces input by 250ms
//   • Cancels in-flight requests when the query changes
//   • Clears results for queries shorter than 2 chars
//   • Never throws — errors surface via `error` state
//   • `provider` tells the UI which backend answered ('nutritionix' | 'usda' | 'mixed' | 'mock')

import { useCallback, useEffect, useRef, useState } from 'react'
import { searchFoods } from '../services/foodSearchService'

const DEBOUNCE_MS = 250

export function useFoodSearch() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [provider, setProvider] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const timerRef = useRef(null)
    const abortRef = useRef(null)

    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current)
        if (abortRef.current) abortRef.current.abort()

        const trimmed = query.trim()
        if (trimmed.length < 2) {
            setResults([])
            setProvider(null)
            setLoading(false)
            setError(null)
            return
        }

        setLoading(true)
        setError(null)

        timerRef.current = setTimeout(async () => {
            const ctrl = new AbortController()
            abortRef.current = ctrl
            try {
                const { results: r, provider: p } = await searchFoods(trimmed, { signal: ctrl.signal })
                if (ctrl.signal.aborted) return
                setResults(r)
                setProvider(p)
            } catch (err) {
                if (err.name === 'AbortError') return
                setError(err.message || 'Search failed')
                setResults([])
            } finally {
                if (!ctrl.signal.aborted) setLoading(false)
            }
        }, DEBOUNCE_MS)

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [query])

    // Clean up on unmount
    useEffect(() => () => {
        if (timerRef.current) clearTimeout(timerRef.current)
        if (abortRef.current) abortRef.current.abort()
    }, [])

    const reset = useCallback(() => {
        setQuery('')
        setResults([])
        setProvider(null)
        setError(null)
        setLoading(false)
    }, [])

    return { query, setQuery, results, provider, loading, error, reset }
}
