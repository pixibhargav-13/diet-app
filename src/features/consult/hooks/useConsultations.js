// useConsultations — all state and actions for the consultations page
// Swap setTimeout stubs for real API calls when backend is ready
import { useState, useCallback } from 'react'

const today = new Date()
const fmt = (d) => d.toISOString().split('T')[0]
const addDays = (n) => { const d = new Date(today); d.setDate(d.getDate() + n); return d }

// ── Mock data ──────────────────────────────────────────────────────────────

const MOCK_UPCOMING = [
  {
    id: 'a1',
    date: fmt(addDays(2)),
    time: '10:00 AM',
    dietitian: 'Dr. Sarah Smith',
    specialty: 'Clinical Nutritionist',
    type: 'Regular',
    status: 'Confirmed',
    meetLink: 'meet.google.com/abc-defg-hij',
    packageSessionsLeft: 4,
  },
  {
    id: 'a2',
    date: fmt(addDays(9)),
    time: '02:30 PM',
    dietitian: 'Dr. Sarah Smith',
    specialty: 'Clinical Nutritionist',
    type: 'Regular',
    status: 'Pending',
    meetLink: null,
    packageSessionsLeft: 3,
  },
]

const MOCK_PAST = [
  {
    id: 'p1',
    date: fmt(addDays(-7)),
    time: '11:00 AM',
    dietitian: 'Dr. Sarah Smith',
    type: 'Regular',
    status: 'Completed',
    summary: {
      notes: 'Great progress this week. Protein intake has improved significantly. Continue with the current meal plan and increase water intake to 3L daily. Start tracking sleep patterns.',
      actions: [
        { id: 'ac1', text: 'Increase water intake to 3L daily', done: true },
        { id: 'ac2', text: 'Log meals every day this week', done: true },
        { id: 'ac3', text: 'Try 20-minute morning walk', done: false },
        { id: 'ac4', text: 'Reduce processed snacks', done: false },
      ],
      rating: 0,
    },
  },
  {
    id: 'p2',
    date: fmt(addDays(-21)),
    time: '10:00 AM',
    dietitian: 'Dr. Sarah Smith',
    type: 'Regular',
    status: 'Completed',
    summary: {
      notes: 'Initial consultation complete. Dietary goals set. Mediterranean-style plan recommended.',
      actions: [
        { id: 'ac5', text: 'Start the Mediterranean meal plan', done: true },
        { id: 'ac6', text: 'Complete onboarding food diary', done: true },
      ],
      rating: 5,
    },
  },
]

// Mock available slots per date (in real app comes from GET /schedule/slots?date=)
const SLOT_TEMPLATES = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '02:00 PM', '02:30 PM', '03:00 PM', '04:00 PM',
]
function getSlotsForDate(dateStr) {
  // Deterministically disable some slots based on date
  const seed = new Date(dateStr).getDate()
  return SLOT_TEMPLATES.map((t, i) => ({ time: t, available: (i + seed) % 3 !== 0 }))
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useConsultations() {
  // List state
  const [activeTab, setActiveTab] = useState('upcoming')
  const [upcoming, setUpcoming] = useState(MOCK_UPCOMING)
  const [past] = useState(MOCK_PAST)

  // Modal visibility
  const [bookingOpen, setBookingOpen] = useState(false)
  const [preFormOpen, setPreFormOpen] = useState(false)
  const [meetOpen, setMeetOpen] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [emergencyOpen, setEmergencyOpen] = useState(false)

  // Currently focused appointment (for meet / summary / pre-form)
  const [focusedAppt, setFocusedAppt] = useState(null)

  // Booking form state
  const [bookDate, setBookDate] = useState(fmt(addDays(1)))
  const [bookSlots, setBookSlots] = useState(getSlotsForDate(fmt(addDays(1))))
  const [bookSlot, setBookSlot] = useState(null)
  const [bookType, setBookType] = useState('Regular')
  const [booking, setBooking] = useState(false)
  const [bookDone, setBookDone] = useState(false)

  // Pre-consult form state
  const [concerns, setConcerns] = useState('')
  const [dietChange, setDietChange] = useState('')
  const [meds, setMeds] = useState('')
  const [labFiles, setLabFiles] = useState([])
  const [submitting, setSubmitting] = useState(false)

  // Emergency state
  const [urgency, setUrgency] = useState('')
  const [emergStep, setEmergStep] = useState(null)   // null | 'pending' | 'accepted' | 'sent'
  const [emergSending, setEmergSending] = useState(false)

  // Actions ─────────────────────────────────────────────────────────────────

  const openBook = useCallback(() => {
    setBookDate(fmt(addDays(1)))
    setBookSlots(getSlotsForDate(fmt(addDays(1))))
    setBookSlot(null); setBookDone(false)
    setBookingOpen(true)
  }, [])

  const changeBookDate = useCallback((d) => {
    setBookDate(d)
    setBookSlots(getSlotsForDate(d))
    setBookSlot(null)
  }, [])

  const confirmBooking = useCallback(async () => {
    if (!bookSlot) return
    setBooking(true)
    try {
      // TODO: await api.post('/consultations/book', { date: bookDate, time: bookSlot, type: bookType })
      await new Promise((r) => setTimeout(r, 900))
      const newAppt = {
        id: `a${Date.now()}`,
        date: bookDate,
        time: bookSlot,
        dietitian: 'Dr. Sarah Smith',
        specialty: 'Clinical Nutritionist',
        type: bookType,
        status: 'Pending',
        meetLink: null,
        packageSessionsLeft: (upcoming[0]?.packageSessionsLeft ?? 3) - 1,
      }
      setUpcoming((prev) => [...prev, newAppt].sort((a, b) => a.date.localeCompare(b.date)))
      setBookDone(true)
    } finally { setBooking(false) }
  }, [bookSlot, bookDate, bookType, upcoming])

  const openPreForm = useCallback((appt) => {
    setFocusedAppt(appt); setConcerns(''); setDietChange(''); setMeds(''); setLabFiles([])
    setPreFormOpen(true)
  }, [])

  const submitPreForm = useCallback(async () => {
    setSubmitting(true)
    try {
      // TODO: await api.post(`/consultations/${focusedAppt.id}/pre-form`, { concerns, dietChange, meds, labFiles })
      await new Promise((r) => setTimeout(r, 800))
      setPreFormOpen(false)
    } finally { setSubmitting(false) }
  }, [])

  const openMeet = useCallback((appt) => { setFocusedAppt(appt); setMeetOpen(true) }, [])
  const openSummary = useCallback((appt) => { setFocusedAppt(appt); setSummaryOpen(true) }, [])

  const submitRating = useCallback(async (apptId, rating) => {
    // TODO: await api.patch(`/consultations/${apptId}/rating`, { rating })
    await new Promise((r) => setTimeout(r, 400))
    return rating
  }, [])

  const sendEmergency = useCallback(async () => {
    if (!urgency.trim()) return
    setEmergSending(true)
    setEmergStep('pending')
    try {
      await new Promise((r) => setTimeout(r, 800))
      setEmergStep('accepted')
      await new Promise((r) => setTimeout(r, 1200))
      setEmergStep('sent')
    } finally { setEmergSending(false) }
  }, [urgency])

  const openEmergency = useCallback(() => {
    setUrgency(''); setEmergStep(null)
    setEmergencyOpen(true)
  }, [])

  return {
    // list
    activeTab, setActiveTab, upcoming, past,
    // modals
    bookingOpen, setBookingOpen,
    preFormOpen, setPreFormOpen,
    meetOpen, setMeetOpen,
    summaryOpen, setSummaryOpen,
    emergencyOpen, setEmergencyOpen,
    focusedAppt,
    // booking
    bookDate, changeBookDate, bookSlots, bookSlot, setBookSlot,
    bookType, setBookType, booking, bookDone, confirmBooking, openBook,
    // pre-form
    concerns, setConcerns, dietChange, setDietChange, meds, setMeds,
    labFiles, setLabFiles, submitting, openPreForm, submitPreForm,
    // meet
    openMeet,
    // summary
    openSummary, submitRating,
    // emergency
    urgency, setUrgency, emergStep, emergSending, sendEmergency, openEmergency,
  }
}
