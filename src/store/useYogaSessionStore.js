import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DAYS_OF_WEEK = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

const ALL_TIME_SLOTS = [
  '06:00 AM','06:30 AM','07:00 AM','07:30 AM','08:00 AM','08:30 AM',
  '09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM',
  '12:00 PM','12:30 PM','01:00 PM','01:30 PM','02:00 PM','02:30 PM',
  '03:00 PM','03:30 PM','04:00 PM','04:30 PM','05:00 PM','05:30 PM',
  '06:00 PM','06:30 PM','07:00 PM','07:30 PM','08:00 PM',
]

const INITIAL_SESSIONS = [
  { id: 'sess-1',  clientId: 'c1',          clientName: 'Priya Sharma',  type: 'yoga',     date: '2026-04-28', time: '09:00 AM', duration: 60, repeat: 'weekly',  meetLink: 'https://meet.google.com/abc-defg-hij', status: 'scheduled',  agreementAccepted: true,  notes: '',                          rescheduleHistory: [], pendingRescheduleId: null, createdAt: '2026-04-01T10:00:00Z' },
  { id: 'sess-2',  clientId: 'c2',          clientName: 'Ravi Mehta',    type: 'exercise', date: '2026-04-29', time: '07:00 AM', duration: 45, repeat: 'weekly',  meetLink: 'https://zoom.us/j/1234567890',         status: 'scheduled',  agreementAccepted: true,  notes: '',                          rescheduleHistory: [], pendingRescheduleId: null, createdAt: '2026-04-01T10:00:00Z' },
  { id: 'sess-3',  clientId: 'c1',          clientName: 'Priya Sharma',  type: 'yoga',     date: '2026-04-10', time: '09:00 AM', duration: 60, repeat: 'none',    meetLink: 'https://meet.google.com/abc-defg-hij', status: 'completed',  agreementAccepted: true,  notes: 'Good session, focused on breathing.', rescheduleHistory: [], pendingRescheduleId: null, createdAt: '2026-04-01T10:00:00Z' },
  { id: 'sess-4',  clientId: 'c3',          clientName: 'Anjali Patel',  type: 'yoga',     date: '2026-04-20', time: '10:00 AM', duration: 60, repeat: 'none',    meetLink: '',                                     status: 'cancelled',  agreementAccepted: true,  notes: '',                          rescheduleHistory: [], pendingRescheduleId: null, createdAt: '2026-04-05T10:00:00Z' },
  { id: 'sess-5',  clientId: 'c5',          clientName: 'Sneha Iyer',    type: 'exercise', date: '2026-04-30', time: '06:00 AM', duration: 45, repeat: 'weekly',  meetLink: 'https://zoom.us/j/9876543210',         status: 'scheduled',  agreementAccepted: false, notes: '',                          rescheduleHistory: [], pendingRescheduleId: null, createdAt: '2026-04-10T10:00:00Z' },
  { id: 'sess-6',  clientId: 'demo-user-1', clientName: 'Demo User',     type: 'yoga',     date: '2026-04-28', time: '08:00 AM', duration: 60, repeat: 'weekly',  meetLink: 'https://meet.google.com/demo-yoga-1',  status: 'scheduled',  agreementAccepted: false, notes: '',                          rescheduleHistory: [], pendingRescheduleId: null, createdAt: '2026-04-15T10:00:00Z' },
  { id: 'sess-7',  clientId: 'demo-user-1', clientName: 'Demo User',     type: 'exercise', date: '2026-05-02', time: '07:30 AM', duration: 45, repeat: 'weekly',  meetLink: 'https://zoom.us/j/demo-exercise-1',    status: 'scheduled',  agreementAccepted: true,  notes: '',                          rescheduleHistory: [], pendingRescheduleId: 'req-demo-1', createdAt: '2026-04-15T10:00:00Z' },
  { id: 'sess-8',  clientId: 'demo-user-1', clientName: 'Demo User',     type: 'yoga',     date: '2026-04-14', time: '08:00 AM', duration: 60, repeat: 'none',    meetLink: 'https://meet.google.com/demo-yoga-past', status: 'completed', agreementAccepted: true,  notes: 'Great focus on core flexibility.', rescheduleHistory: [], pendingRescheduleId: null, createdAt: '2026-04-10T10:00:00Z' },
  { id: 'sess-9',  clientId: 'c7',          clientName: 'Meera Joshi',   type: 'yoga',     date: '2026-04-25', time: '11:00 AM', duration: 60, repeat: 'weekly',  meetLink: 'https://meet.google.com/meera-yoga',   status: 'scheduled',  agreementAccepted: true,  notes: '',                          rescheduleHistory: [], pendingRescheduleId: null, createdAt: '2026-04-10T10:00:00Z' },
  { id: 'sess-10', clientId: 'c4',          clientName: 'Karan Verma',   type: 'exercise', date: '2026-04-11', time: '06:30 AM', duration: 45, repeat: 'none',    meetLink: 'https://zoom.us/j/karan-exercise',     status: 'completed',  agreementAccepted: true,  notes: 'Increased reps on upper body.',    rescheduleHistory: [], pendingRescheduleId: null, createdAt: '2026-04-01T10:00:00Z' },
]

const INITIAL_PACKAGES = [
  { id: 'pkg-1', clientId: 'c1',          clientName: 'Priya Sharma', name: 'Yoga Starter',    sessionCount: 10, sessionsUsed: 3, price: 4500,  active: true, createdAt: '2026-04-01' },
  { id: 'pkg-2', clientId: 'c2',          clientName: 'Ravi Mehta',   name: 'Exercise Pro',    sessionCount: 5,  sessionsUsed: 2, price: 3000,  active: true, createdAt: '2026-04-02' },
  { id: 'pkg-3', clientId: 'c5',          clientName: 'Sneha Iyer',   name: 'Yoga Basic',      sessionCount: 5,  sessionsUsed: 0, price: 2500,  active: true, createdAt: '2026-04-10' },
  { id: 'pkg-4', clientId: 'demo-user-1', clientName: 'Demo User',    name: 'Wellness Bundle', sessionCount: 8,  sessionsUsed: 1, price: 3800,  active: true, createdAt: '2026-04-15' },
  { id: 'pkg-5', clientId: 'c7',          clientName: 'Meera Joshi',  name: 'Yoga Monthly',    sessionCount: 12, sessionsUsed: 4, price: 5500,  active: true, createdAt: '2026-04-05' },
]

const DEFAULT_POLICY = {
  cancellationNoticeHours: 24,
  maxReschedulePerMonth: 2,
  clientOverrides: {},
}

const DEFAULT_AVAILABILITY = {
  monday:    { enabled: true,  start: '06:00 AM', end: '08:00 PM' },
  tuesday:   { enabled: true,  start: '06:00 AM', end: '08:00 PM' },
  wednesday: { enabled: true,  start: '06:00 AM', end: '08:00 PM' },
  thursday:  { enabled: true,  start: '06:00 AM', end: '08:00 PM' },
  friday:    { enabled: true,  start: '06:00 AM', end: '08:00 PM' },
  saturday:  { enabled: true,  start: '06:00 AM', end: '02:00 PM' },
  sunday:    { enabled: false, start: '06:00 AM', end: '12:00 PM' },
}

const INITIAL_RESCHEDULE_REQUESTS = [
  {
    id: 'req-demo-1',
    sessionId: 'sess-7',
    clientId: 'demo-user-1',
    clientName: 'Demo User',
    sessionType: 'exercise',
    originalDate: '2026-05-02',
    originalTime: '07:30 AM',
    requestedDate: '2026-05-03',
    requestedTime: '09:00 AM',
    status: 'pending',
    rejectionReason: '',
    createdAt: '2026-04-28T06:00:00Z',
    resolvedAt: '',
  },
]

function to24h(timeStr) {
  const [time, mod] = timeStr.split(' ')
  let [h, m] = time.split(':')
  if (mod === 'PM' && h !== '12') h = String(parseInt(h, 10) + 12)
  if (mod === 'AM' && h === '12') h = '00'
  return `${String(h).padStart(2, '0')}:${m}:00`
}

export const useYogaSessionStore = create(
  persist(
    (set, get) => ({
      sessions: INITIAL_SESSIONS,
      packages: INITIAL_PACKAGES,
      policy: DEFAULT_POLICY,
      instructorAvailability: DEFAULT_AVAILABILITY,
      rescheduleRequests: INITIAL_RESCHEDULE_REQUESTS,

      // ── Sessions ──────────────────────────────────────────────────────────
      addSession: (session) => {
        const base = {
          ...session,
          id: `sess-${Date.now()}`,
          status: 'scheduled',
          agreementAccepted: false,
          rescheduleHistory: [],
          pendingRescheduleId: null,
          createdAt: new Date().toISOString(),
        }
        const toAdd = [base]

        if (session.repeat === 'weekly') {
          for (let i = 1; i <= 3; i++) {
            const d = new Date(session.date + 'T12:00')
            d.setDate(d.getDate() + 7 * i)
            toAdd.push({
              ...base,
              id: `sess-${Date.now()}-w${i}`,
              date: d.toISOString().split('T')[0],
            })
          }
        }

        set((s) => ({ sessions: [...s.sessions, ...toAdd] }))
        return base
      },

      updateSession: (id, changes) =>
        set((s) => ({
          sessions: s.sessions.map((sess) => (sess.id === id ? { ...sess, ...changes } : sess)),
        })),

      cancelSession: (id) =>
        set((s) => ({
          sessions: s.sessions.map((sess) =>
            sess.id === id ? { ...sess, status: 'cancelled' } : sess
          ),
        })),

      completeSession: (id, notes = '') =>
        set((s) => ({
          sessions: s.sessions.map((sess) =>
            sess.id === id ? { ...sess, status: 'completed', notes } : sess
          ),
        })),

      // Admin / instructor direct reschedule (no approval needed)
      rescheduleSession: (id, newDate, newTime) => {
        const { sessions, policy } = get()
        const sess = sessions.find((s) => s.id === id)
        if (!sess) return { ok: false, reason: 'NOT_FOUND' }

        const now = new Date()
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const monthReschedules = sess.rescheduleHistory.filter(
          (r) => new Date(r.at) >= monthStart
        ).length

        const override = policy.clientOverrides[sess.clientId]
        const maxR = override?.maxReschedulePerMonth ?? policy.maxReschedulePerMonth
        if (monthReschedules >= maxR) return { ok: false, reason: 'LIMIT_EXCEEDED', max: maxR }

        const sessionDT = new Date(`${sess.date}T${to24h(sess.time)}`)
        const hoursUntil = (sessionDT - now) / (1000 * 60 * 60)
        const noticeH = override?.cancellationNoticeHours ?? policy.cancellationNoticeHours
        if (hoursUntil < noticeH) return { ok: false, reason: 'NOTICE_PERIOD', hours: noticeH }

        set((s) => ({
          sessions: s.sessions.map((item) =>
            item.id === id
              ? {
                  ...item,
                  date: newDate,
                  time: newTime,
                  status: 'scheduled',
                  rescheduleHistory: [
                    ...item.rescheduleHistory,
                    { from: { date: sess.date, time: sess.time }, to: { date: newDate, time: newTime }, at: now.toISOString() },
                  ],
                }
              : item
          ),
        }))
        return { ok: true }
      },

      // ── User Reschedule Request (needs instructor approval) ─────────────
      submitRescheduleRequest: (sessionId, newDate, newTime) => {
        const { sessions, policy, rescheduleRequests } = get()
        const sess = sessions.find((s) => s.id === sessionId)
        if (!sess) return { ok: false, reason: 'NOT_FOUND' }

        // Block if a pending request already exists for this session
        const hasPending = rescheduleRequests.some(
          (r) => r.sessionId === sessionId && r.status === 'pending'
        )
        if (hasPending) return { ok: false, reason: 'ALREADY_PENDING' }

        // Check monthly reschedule limit
        const now = new Date()
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const monthReschedules = sess.rescheduleHistory.filter(
          (r) => new Date(r.at) >= monthStart
        ).length
        // Also count pending requests this month
        const pendingThisMonth = rescheduleRequests.filter(
          (r) => r.sessionId === sessionId && r.status === 'pending' && new Date(r.createdAt) >= monthStart
        ).length

        const override = policy.clientOverrides[sess.clientId]
        const maxR = override?.maxReschedulePerMonth ?? policy.maxReschedulePerMonth
        if ((monthReschedules + pendingThisMonth) >= maxR) return { ok: false, reason: 'LIMIT_EXCEEDED', max: maxR }

        // Check notice period
        const sessionDT = new Date(`${sess.date}T${to24h(sess.time)}`)
        const hoursUntil = (sessionDT - now) / (1000 * 60 * 60)
        const noticeH = override?.cancellationNoticeHours ?? policy.cancellationNoticeHours
        if (hoursUntil < noticeH) return { ok: false, reason: 'NOTICE_PERIOD', hours: noticeH }

        const request = {
          id: `req-${Date.now()}`,
          sessionId,
          clientId: sess.clientId,
          clientName: sess.clientName,
          sessionType: sess.type,
          originalDate: sess.date,
          originalTime: sess.time,
          requestedDate: newDate,
          requestedTime: newTime,
          status: 'pending',
          rejectionReason: '',
          createdAt: now.toISOString(),
          resolvedAt: '',
        }

        set((s) => ({
          rescheduleRequests: [...s.rescheduleRequests, request],
          sessions: s.sessions.map((item) =>
            item.id === sessionId ? { ...item, pendingRescheduleId: request.id } : item
          ),
        }))

        return { ok: true, request }
      },

      approveReschedule: (requestId) => {
        const { rescheduleRequests } = get()
        const req = rescheduleRequests.find((r) => r.id === requestId)
        if (!req || req.status !== 'pending') return false

        const now = new Date().toISOString()

        set((s) => ({
          rescheduleRequests: s.rescheduleRequests.map((r) =>
            r.id === requestId ? { ...r, status: 'approved', resolvedAt: now } : r
          ),
          sessions: s.sessions.map((sess) =>
            sess.id === req.sessionId
              ? {
                  ...sess,
                  date: req.requestedDate,
                  time: req.requestedTime,
                  pendingRescheduleId: null,
                  rescheduleHistory: [
                    ...sess.rescheduleHistory,
                    { from: { date: req.originalDate, time: req.originalTime }, to: { date: req.requestedDate, time: req.requestedTime }, at: now },
                  ],
                }
              : sess
          ),
        }))
        return true
      },

      rejectReschedule: (requestId, reason = '') => {
        const { rescheduleRequests } = get()
        const req = rescheduleRequests.find((r) => r.id === requestId)
        if (!req || req.status !== 'pending') return false

        const now = new Date().toISOString()

        set((s) => ({
          rescheduleRequests: s.rescheduleRequests.map((r) =>
            r.id === requestId ? { ...r, status: 'rejected', rejectionReason: reason, resolvedAt: now } : r
          ),
          sessions: s.sessions.map((sess) =>
            sess.id === req.sessionId ? { ...sess, pendingRescheduleId: null } : sess
          ),
        }))
        return true
      },

      // Dismiss a rejection notification so user doesn't keep seeing it
      dismissRejection: (requestId) =>
        set((s) => ({
          rescheduleRequests: s.rescheduleRequests.map((r) =>
            r.id === requestId ? { ...r, dismissed: true } : r
          ),
        })),

      acceptAgreement: (sessionId) =>
        set((s) => ({
          sessions: s.sessions.map((sess) =>
            sess.id === sessionId ? { ...sess, agreementAccepted: true } : sess
          ),
        })),

      // ── Packages ──────────────────────────────────────────────────────────
      addPackage: (pkg) =>
        set((s) => ({
          packages: [
            ...s.packages,
            { ...pkg, id: `pkg-${Date.now()}`, sessionsUsed: 0, createdAt: new Date().toISOString().split('T')[0] },
          ],
        })),

      updatePackage: (id, changes) =>
        set((s) => ({
          packages: s.packages.map((p) => (p.id === id ? { ...p, ...changes } : p)),
        })),

      deletePackage: (id) =>
        set((s) => ({ packages: s.packages.filter((p) => p.id !== id) })),

      // ── Policy ────────────────────────────────────────────────────────────
      updatePolicy: (changes) =>
        set((s) => ({ policy: { ...s.policy, ...changes } })),

      updateClientPolicy: (clientId, changes) =>
        set((s) => ({
          policy: {
            ...s.policy,
            clientOverrides: {
              ...s.policy.clientOverrides,
              [clientId]: { ...(s.policy.clientOverrides[clientId] ?? {}), ...changes },
            },
          },
        })),

      clearClientPolicy: (clientId) =>
        set((s) => {
          const overrides = { ...s.policy.clientOverrides }
          delete overrides[clientId]
          return { policy: { ...s.policy, clientOverrides: overrides } }
        }),

      // ── Instructor Availability ───────────────────────────────────────────
      updateInstructorAvailability: (day, changes) =>
        set((s) => ({
          instructorAvailability: {
            ...s.instructorAvailability,
            [day]: { ...s.instructorAvailability[day], ...changes },
          },
        })),

      /**
       * Returns the available time slots for a given date based on
       * instructor availability settings and already-booked sessions.
       */
      getAvailableSlotsForDate: (dateStr) => {
        const { instructorAvailability, sessions } = get()
        if (!dateStr) return []

        const d = new Date(dateStr + 'T12:00')
        const dayName = DAYS_OF_WEEK[d.getDay()]
        const dayConfig = instructorAvailability[dayName]

        if (!dayConfig?.enabled) return []

        const startIdx = ALL_TIME_SLOTS.indexOf(dayConfig.start)
        const endIdx = ALL_TIME_SLOTS.indexOf(dayConfig.end)
        if (startIdx === -1 || endIdx === -1) return [...ALL_TIME_SLOTS]

        const available = ALL_TIME_SLOTS.slice(startIdx, endIdx + 1)

        // Filter out slots that are already booked on that date
        const bookedSlots = sessions
          .filter((s) => s.date === dateStr && s.status === 'scheduled')
          .map((s) => s.time)

        return available.filter((slot) => !bookedSlots.includes(slot))
      },

      /**
       * Check if a specific date is available (day is enabled)
       */
      isDayAvailable: (dateStr) => {
        const { instructorAvailability } = get()
        if (!dateStr) return false
        const d = new Date(dateStr + 'T12:00')
        const dayName = DAYS_OF_WEEK[d.getDay()]
        return instructorAvailability[dayName]?.enabled ?? false
      },

      // ── Derived helpers ───────────────────────────────────────────────────
      getClientStats: (clientId) => {
        const { sessions } = get()
        const all = sessions.filter((s) => s.clientId === clientId)
        return {
          total: all.length,
          completed: all.filter((s) => s.status === 'completed').length,
          scheduled: all.filter((s) => s.status === 'scheduled').length,
          cancelled: all.filter((s) => s.status === 'cancelled').length,
          rescheduled: all.filter((s) => s.rescheduleHistory.length > 0).length,
        }
      },

      getClientPackages: (clientId) => {
        const { packages } = get()
        return packages.filter((p) => p.clientId === clientId && p.active)
      },

      getPendingRequests: () => {
        return get().rescheduleRequests.filter((r) => r.status === 'pending')
      },

      getRequestsForSession: (sessionId) => {
        return get().rescheduleRequests.filter((r) => r.sessionId === sessionId)
      },

      getClientRequests: (clientId) => {
        return get().rescheduleRequests.filter((r) => r.clientId === clientId)
      },
    }),
    {
      name: 'vitals-yoga-sessions-v2',
      partialize: (s) => ({
        sessions: s.sessions,
        packages: s.packages,
        policy: s.policy,
        instructorAvailability: s.instructorAvailability,
        rescheduleRequests: s.rescheduleRequests,
      }),
    }
  )
)
