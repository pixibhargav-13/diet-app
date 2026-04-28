import { useState, useMemo, useEffect } from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import { useYogaSessionStore } from '../../store/useYogaSessionStore'
import styles from './MySessionsPage.module.css'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T12:00')
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

function daysUntil(dateStr) {
  const today = new Date(); today.setHours(0,0,0,0)
  const target = new Date(dateStr + 'T00:00:00')
  const diff = Math.round((target - today) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff > 0) return `In ${diff} days`
  return `${Math.abs(diff)}d ago`
}

function formatTimeAgo(isoStr) {
  if (!isoStr) return ''
  const diff = Date.now() - new Date(isoStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export default function MySessionsPage() {
  const user = useAuthStore((s) => s.user)
  const {
    sessions,
    acceptAgreement,
    submitRescheduleRequest,
    cancelSession,
    policy,
    rescheduleRequests,
    getAvailableSlotsForDate,
    isDayAvailable,
    dismissRejection,
  } = useYogaSessionStore()

  const [tab, setTab] = useState('upcoming')

  // Agreement modal
  const [agreementSession, setAgreementSession] = useState(null)
  const [agreementChecked, setAgreementChecked] = useState(false)

  // Reschedule modal
  const [rescheduleModal, setRescheduleModal] = useState(null)
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [rescheduleTime, setRescheduleTime] = useState('')
  const [rescheduleError, setRescheduleError] = useState('')

  // Cancel confirm
  const [cancelConfirm, setCancelConfirm] = useState(null)

  // Toast
  const [toast, setToast] = useState(null)
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4000)
  }

  const today = new Date().toISOString().split('T')[0]
  const mySessions = useMemo(() => sessions.filter((s) => s.clientId === user?.id), [sessions, user])

  const upcoming  = useMemo(() => mySessions.filter((s) => s.status === 'scheduled').sort((a, b) => a.date > b.date ? 1 : -1), [mySessions])
  const past      = useMemo(() => mySessions.filter((s) => s.status === 'completed').sort((a, b) => a.date < b.date ? 1 : -1), [mySessions])
  const cancelled = useMemo(() => mySessions.filter((s) => s.status === 'cancelled').sort((a, b) => a.date < b.date ? 1 : -1), [mySessions])

  const stats = { total: mySessions.length, upcoming: upcoming.length, completed: past.length, cancelled: cancelled.length }

  // Check if any upcoming session needs agreement
  const pendingAgreement = useMemo(() => upcoming.filter((s) => !s.agreementAccepted), [upcoming])

  // Get rejected requests for this user (not dismissed)
  const rejectedRequests = useMemo(
    () => rescheduleRequests.filter((r) => r.clientId === user?.id && r.status === 'rejected' && !r.dismissed),
    [rescheduleRequests, user]
  )

  // Get available slots based on selected date
  const availableSlots = useMemo(
    () => rescheduleDate ? getAvailableSlotsForDate(rescheduleDate) : [],
    [rescheduleDate, getAvailableSlotsForDate]
  )

  const dateAvailable = useMemo(
    () => rescheduleDate ? isDayAvailable(rescheduleDate) : true,
    [rescheduleDate, isDayAvailable]
  )

  // Reset time when date changes and slots update
  useEffect(() => {
    if (availableSlots.length > 0 && !availableSlots.includes(rescheduleTime)) {
      setRescheduleTime(availableSlots[0])
    }
  }, [availableSlots, rescheduleTime])

  // Get pending request for a session (if any)
  const getPendingForSession = (sessionId) =>
    rescheduleRequests.find((r) => r.sessionId === sessionId && r.status === 'pending')

  const handleAcceptAgreement = () => {
    if (!agreementChecked) return
    acceptAgreement(agreementSession.id)
    setAgreementSession(null)
    setAgreementChecked(false)
  }

  const handleReschedule = () => {
    if (!rescheduleDate || !rescheduleTime) return
    const result = submitRescheduleRequest(rescheduleModal.id, rescheduleDate, rescheduleTime)
    if (!result.ok) {
      if (result.reason === 'LIMIT_EXCEEDED')
        setRescheduleError(`You have used all ${result.max} reschedules allowed this month.`)
      else if (result.reason === 'NOTICE_PERIOD')
        setRescheduleError(`Rescheduling requires at least ${result.hours} hours notice before the session.`)
      else if (result.reason === 'ALREADY_PENDING')
        setRescheduleError('A reschedule request is already pending for this session. Please wait for instructor confirmation.')
      else setRescheduleError('Cannot reschedule this session. Please contact your instructor.')
      return
    }
    setRescheduleModal(null)
    setRescheduleError('')
    showToast('✅ Reschedule request sent! Your instructor will confirm shortly.')
  }

  const openReschedule = (sess) => {
    if (!sess.agreementAccepted) { setAgreementSession(sess); return }
    // Block if pending request already exists
    const pending = getPendingForSession(sess.id)
    if (pending) {
      setRescheduleError('A reschedule request is already pending for this session.')
      return
    }
    setRescheduleModal(sess)
    setRescheduleDate(sess.date)
    setRescheduleTime(sess.time)
    setRescheduleError('')
  }

  const currentSessions = tab === 'upcoming' ? upcoming : tab === 'past' ? past : cancelled

  return (
    <div className={styles.page}>
      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${styles['toast_' + toast.type]}`}>
          {toast.msg}
          <button type="button" className={styles.toastClose} onClick={() => setToast(null)}>✕</button>
        </div>
      )}

      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.heading}>My Sessions</h1>
          <p className={styles.sub}>View and manage your yoga &amp; exercise sessions.</p>
        </div>
      </div>

      {/* Rejection notifications */}
      {rejectedRequests.map((req) => (
        <div key={req.id} className={styles.rejectionBanner}>
          <div className={styles.bannerIcon}>❌</div>
          <div className={styles.bannerContent}>
            <p className={styles.bannerTitle}>Reschedule request declined</p>
            <p className={styles.bannerDesc}>
              Your request to move your {req.sessionType} session from{' '}
              <strong>{formatDate(req.originalDate)}</strong> at <strong>{req.originalTime}</strong> to{' '}
              <strong>{formatDate(req.requestedDate)}</strong> at <strong>{req.requestedTime}</strong> was declined.
            </p>
            {req.rejectionReason && (
              <p className={styles.rejectionReason}>
                <strong>Instructor's note:</strong> {req.rejectionReason}
              </p>
            )}
          </div>
          <button type="button" className={styles.dismissBtn} onClick={() => dismissRejection(req.id)} title="Dismiss">✕</button>
        </div>
      ))}

      {/* Agreement banner */}
      {pendingAgreement.length > 0 && (
        <div className={styles.agreementBanner}>
          <div className={styles.bannerIcon}>📋</div>
          <div className={styles.bannerContent}>
            <p className={styles.bannerTitle}>Agreement required for {pendingAgreement.length} session{pendingAgreement.length > 1 ? 's' : ''}</p>
            <p className={styles.bannerDesc}>Please review and accept the booking policy before your session(s).</p>
          </div>
          <button type="button" className={styles.bannerBtn} onClick={() => { setAgreementSession(pendingAgreement[0]); setAgreementChecked(false) }}>
            Review &amp; Accept
          </button>
        </div>
      )}

      {/* Stats row */}
      <div className={styles.statsRow}>
        {[
          { label: 'Total Sessions', value: stats.total, color: '#2a4365' },
          { label: 'Upcoming', value: stats.upcoming, color: '#22c55e' },
          { label: 'Completed', value: stats.completed, color: '#6b7280' },
          { label: 'Cancelled', value: stats.cancelled, color: '#ef4444' },
        ].map((s) => (
          <div key={s.label} className={styles.statCard} style={{ borderTopColor: s.color }}>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Package info if available */}
      <PackageInfo userId={user?.id} />

      {/* Tabs */}
      <div className={styles.tabBar}>
        <button type="button" className={`${styles.tabBtn} ${tab === 'upcoming' ? styles.tabBtnActive : ''}`} onClick={() => setTab('upcoming')}>
          Upcoming <span className={styles.tabCount}>{upcoming.length}</span>
        </button>
        <button type="button" className={`${styles.tabBtn} ${tab === 'past' ? styles.tabBtnActive : ''}`} onClick={() => setTab('past')}>
          Completed <span className={styles.tabCount}>{past.length}</span>
        </button>
        <button type="button" className={`${styles.tabBtn} ${tab === 'cancelled' ? styles.tabBtnActive : ''}`} onClick={() => setTab('cancelled')}>
          Cancelled <span className={styles.tabCount}>{cancelled.length}</span>
        </button>
      </div>

      {/* Session list */}
      <div className={styles.sessionList}>
        {currentSessions.length === 0 && (
          <div className={styles.empty}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="40" height="40" style={{ color: '#d1d5db' }}>
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <p>No {tab} sessions.</p>
          </div>
        )}
        {currentSessions.map((sess) => {
          const pendingReq = getPendingForSession(sess.id)
          const hasPending = !!pendingReq

          return (
            <div key={sess.id} className={`${styles.sessionCard} ${!sess.agreementAccepted && sess.status === 'scheduled' ? styles.sessionCardPending : ''} ${hasPending ? styles.sessionCardReschedule : ''}`}>
              <div className={styles.sessionTop}>
                <div className={styles.sessionTypeIcon} data-type={sess.type}>
                  {sess.type === 'yoga' ? '🧘' : '🏋️'}
                </div>
                <div className={styles.sessionInfo}>
                  <div className={styles.sessionTitleRow}>
                    <span className={styles.sessionType}>{sess.type === 'yoga' ? 'Yoga Session' : 'Exercise Session'}</span>
                    {sess.repeat === 'weekly' && <span className={styles.repeatTag}>↻ Weekly</span>}
                    {sess.rescheduleHistory.length > 0 && <span className={styles.rescheduledTag}>Rescheduled</span>}
                    {hasPending && <span className={styles.pendingTag}>⏳ Reschedule Pending</span>}
                  </div>
                  <div className={styles.sessionMeta}>
                    <span>📅 {formatDate(sess.date)}</span>
                    <span>⏰ {sess.time}</span>
                    <span>⏱ {sess.duration} min</span>
                    {tab === 'upcoming' && <span className={styles.daysTag}>{daysUntil(sess.date)}</span>}
                  </div>
                  {/* Show pending reschedule info */}
                  {hasPending && (
                    <div className={styles.pendingInfo}>
                      <span className={styles.pendingInfoIcon}>🔄</span>
                      <span>
                        Requested move to <strong>{formatDate(pendingReq.requestedDate)}</strong> at <strong>{pendingReq.requestedTime}</strong>
                        <span className={styles.pendingTime}> — {formatTimeAgo(pendingReq.createdAt)}</span>
                      </span>
                    </div>
                  )}
                  {sess.notes && <p className={styles.sessionNotes}>{sess.notes}</p>}
                </div>
              </div>

              <div className={styles.sessionActions}>
                {sess.meetLink && sess.status === 'scheduled' && (
                  <a href={sess.meetLink} target="_blank" rel="noreferrer" className={styles.meetBtn}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.87v6.26a1 1 0 0 1-1.447.899L15 14M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z"/></svg>
                    Join Session
                  </a>
                )}
                {!sess.agreementAccepted && sess.status === 'scheduled' && (
                  <button type="button" className={styles.agreementBtn} onClick={() => { setAgreementSession(sess); setAgreementChecked(false) }}>
                    Accept Policy
                  </button>
                )}
                {sess.status === 'scheduled' && (
                  <>
                    <button
                      type="button"
                      className={`${styles.rescheduleBtn} ${hasPending ? styles.rescheduleDisabled : ''}`}
                      onClick={() => !hasPending && openReschedule(sess)}
                      disabled={hasPending}
                      title={hasPending ? 'A reschedule request is already pending' : 'Reschedule session'}
                    >
                      {hasPending ? '⏳ Pending' : 'Reschedule'}
                    </button>
                    <button type="button" className={styles.cancelSessionBtn} onClick={() => setCancelConfirm(sess)}>
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Agreement Modal */}
      {agreementSession && (
        <div className={styles.overlay} onClick={() => setAgreementSession(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <p className={styles.modalTitle}>Booking Policy Agreement</p>
              <button type="button" className={styles.modalClose} onClick={() => setAgreementSession(null)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.policyBox}>
                <p className={styles.policyTitle}>Terms for your {agreementSession.type} session on {formatDate(agreementSession.date)}</p>
                <ul className={styles.policyList}>
                  <li>
                    <strong>Cancellation Notice:</strong> A minimum of <strong>{policy.clientOverrides[agreementSession.clientId]?.cancellationNoticeHours ?? policy.cancellationNoticeHours} hours</strong> notice is required before rescheduling or cancelling a session.
                  </li>
                  <li>
                    <strong>Reschedule Limit:</strong> You may reschedule up to <strong>{policy.clientOverrides[agreementSession.clientId]?.maxReschedulePerMonth ?? policy.maxReschedulePerMonth} times per month</strong>. Late changes may result in the session being counted as used.
                  </li>
                  <li>
                    <strong>Reschedule Approval:</strong> All reschedule requests require <strong>instructor confirmation</strong>. Your session keeps its original time until the instructor approves the change.
                  </li>
                  <li>
                    <strong>No-Show Policy:</strong> Failing to join a session without notice will count as a completed session from your package.
                  </li>
                  <li>
                    <strong>Session Links:</strong> The Zoom/Google Meet link will be provided and should not be shared with others.
                  </li>
                </ul>
              </div>
              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={agreementChecked}
                  onChange={(e) => setAgreementChecked(e.target.checked)}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxLabel}>
                  I have read and agree to the session booking policy.
                </span>
              </label>
            </div>
            <div className={styles.modalFooter}>
              <button type="button" className={styles.cancelBtn} onClick={() => setAgreementSession(null)}>Cancel</button>
              <button
                type="button"
                className={styles.submitBtn}
                disabled={!agreementChecked}
                onClick={handleAcceptAgreement}
                style={{ opacity: agreementChecked ? 1 : 0.5, cursor: agreementChecked ? 'pointer' : 'not-allowed' }}
              >
                Accept &amp; Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModal && (
        <div className={styles.overlay} onClick={() => { setRescheduleModal(null); setRescheduleError('') }}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <p className={styles.modalTitle}>Request Reschedule</p>
              <button type="button" className={styles.modalClose} onClick={() => { setRescheduleModal(null); setRescheduleError('') }}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.rescheduleInfo}>
                Current: <strong>{formatDate(rescheduleModal.date)}</strong> at <strong>{rescheduleModal.time}</strong>
              </p>
              <div className={styles.rescheduleNote}>
                <strong>Note:</strong> You have used {
                  rescheduleModal.rescheduleHistory.filter(r => {
                    const now = new Date(); const ms = new Date(now.getFullYear(), now.getMonth(), 1)
                    return new Date(r.at) >= ms
                  }).length
                } of {policy.clientOverrides[rescheduleModal.clientId]?.maxReschedulePerMonth ?? policy.maxReschedulePerMonth} reschedules this month.
              </div>

              <div className={styles.approvalNote}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                <span>Your reschedule request will be sent to the instructor for approval. The session keeps its current time until confirmed.</span>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>New Date</label>
                  <input type="date" className={styles.input} value={rescheduleDate} min={today} onChange={(e) => setRescheduleDate(e.target.value)} />
                  {rescheduleDate && !dateAvailable && (
                    <span className={styles.dayUnavailable}>⚠ Instructor is unavailable on this day</span>
                  )}
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>New Time</label>
                  {availableSlots.length > 0 ? (
                    <select className={styles.input} value={rescheduleTime} onChange={(e) => setRescheduleTime(e.target.value)}>
                      {availableSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  ) : (
                    <div className={styles.noSlots}>
                      {rescheduleDate
                        ? (dateAvailable ? 'All slots are booked on this date' : 'Instructor unavailable — choose another date')
                        : 'Select a date first'}
                    </div>
                  )}
                </div>
              </div>
              {rescheduleError && <p className={styles.errorMsg}>{rescheduleError}</p>}
            </div>
            <div className={styles.modalFooter}>
              <button type="button" className={styles.cancelBtn} onClick={() => { setRescheduleModal(null); setRescheduleError('') }}>Cancel</button>
              <button
                type="button"
                className={styles.submitBtn}
                onClick={handleReschedule}
                disabled={!rescheduleDate || !rescheduleTime || availableSlots.length === 0}
                style={{ opacity: (!rescheduleDate || !rescheduleTime || availableSlots.length === 0) ? 0.5 : 1 }}
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel confirm */}
      {cancelConfirm && (
        <div className={styles.overlay} onClick={() => setCancelConfirm(null)}>
          <div className={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
            <p className={styles.confirmTitle}>Cancel Session?</p>
            <p className={styles.confirmText}>
              {formatDate(cancelConfirm.date)} at {cancelConfirm.time} — {cancelConfirm.type} session
            </p>
            <p className={styles.confirmWarn}>
              This session will be marked as cancelled and may count toward your package.
            </p>
            <div className={styles.confirmActions}>
              <button type="button" className={styles.cancelBtn} onClick={() => setCancelConfirm(null)}>Keep Session</button>
              <button type="button" className={styles.dangerBtn} onClick={() => { cancelSession(cancelConfirm.id); setCancelConfirm(null) }}>Cancel Session</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function PackageInfo({ userId }) {
  const getClientPackages = useYogaSessionStore((s) => s.getClientPackages)
  const pkgs = getClientPackages(userId ?? '')
  if (pkgs.length === 0) return null

  return (
    <div className={styles.packageRow}>
      {pkgs.map((pkg) => {
        const remaining = pkg.sessionCount - pkg.sessionsUsed
        const pct = pkg.sessionCount > 0 ? Math.min((pkg.sessionsUsed / pkg.sessionCount) * 100, 100) : 0
        return (
          <div key={pkg.id} className={styles.pkgCard}>
            <div className={styles.pkgInfo}>
              <span className={styles.pkgName}>{pkg.name}</span>
              <span className={styles.pkgRemaining}>{remaining} sessions left</span>
            </div>
            <div className={styles.pkgBar}>
              <div className={styles.pkgFill} style={{ width: `${pct}%`, background: remaining <= 1 ? '#ef4444' : '#22c55e' }} />
            </div>
            <div className={styles.pkgStats}>
              <span>{pkg.sessionsUsed} used</span>
              <span>{pkg.sessionCount} total</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
