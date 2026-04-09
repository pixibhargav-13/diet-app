import { useCallback, useState } from 'react'

const TODAY = new Date().toISOString().split('T')[0]

const MOODS = ['great', 'okay', 'tired', 'stressed', 'strong']

const EMPTY_MEASUREMENTS = { waist: '', hips: '', chest: '', arms: '', thighs: '' }

// Mock previous entry — replace with API call
const MOCK_PREV = {
  date: '2025-04-02',
  weight: 78.4,
  unit: 'kg',
  measurements: { waist: 82, hips: 96, chest: 88, arms: 33, thighs: 58 },
  steps: 7843,
  notes: 'Felt good after morning walk.',
  mood: 'great',
}

function kgToLbs(kg) { return +(kg * 2.20462).toFixed(1) }
function lbsToKg(lbs) { return +(lbs / 2.20462).toFixed(1) }

export function useProgressLog() {
  const [date, setDate] = useState(TODAY)
  const [unit, setUnit] = useState('kg')
  const [weight, setWeight] = useState('')
  const [measurements, setMeasurements] = useState(EMPTY_MEASUREMENTS)
  const [measurementsOpen, setMeasurementsOpen] = useState(false)
  const [steps, setSteps] = useState('')
  const [notes, setNotes] = useState('')
  const [mood, setMood] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const toggleUnit = useCallback(() => {
    setUnit((currentUnit) => {
      const next = currentUnit === 'kg' ? 'lbs' : 'kg'
      if (weight) {
        setWeight(currentUnit === 'kg' ? String(kgToLbs(+weight)) : String(lbsToKg(+weight)))
      }
      return next
    })
  }, [weight])

  const setMeasurement = useCallback((key, val) => {
    setMeasurements((prev) => ({ ...prev, [key]: val }))
  }, [])

  const validate = useCallback(() => {
    const nextErrors = {}
    if (!weight) nextErrors.weight = 'Weight is required'
    if (weight && isNaN(+weight)) nextErrors.weight = 'Must be a number'
    return nextErrors
  }, [weight])

  const save = useCallback(async () => {
    if (isSaving) return false

    const nextErrors = validate()
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return false
    }

    setErrors({})
    setIsSaving(true)

    try {
      await new Promise((r) => setTimeout(r, 700))
      return true
    } finally {
      setIsSaving(false)
    }
  }, [isSaving, validate])

  return {
    date, setDate,
    unit, toggleUnit,
    weight, setWeight,
    measurements, setMeasurement,
    measurementsOpen, setMeasurementsOpen,
    steps, setSteps,
    notes, setNotes,
    mood, setMood,
    moods: MOODS,
    isSaving,
    errors,
    save,
    prevEntry: MOCK_PREV,
  }
}