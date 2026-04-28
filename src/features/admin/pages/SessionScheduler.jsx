import { useState, useMemo } from 'react'
import { useYogaSessionStore } from '../../../store/useYogaSessionStore'
import { CLIENTS } from '../data/adminMockData'
import styles from './SessionScheduler.module.css'

const TYPE_OPTS = ['yoga', 'exercise']
const DURATION_OPTS = [30, 45, 60, 90]
const REPEAT_OPTS = ['none', 'weekly']
const STATUS_FILTER_OPTS = ['all', 'scheduled', 'completed', 'cancelled']
const TIME_SLOTS = [
  '06:00 AM','06:30 AM','07:00 AM','07:30 AM','08:00 AM','08:30 AM',
  '09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM',
  '12:00 PM','12:30 PM','01:00 PM','01:30 PM','02:00 PM','02:30 PM',
  '03:00 PM','03:30 PM','04:00 PM','04:30 PM','05:00 PM','05:30 PM',
  '06:00 PM','06:30 PM','07:00 PM','07:30 PM','08:00 PM',
]
const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']

const EMPTY_FORM = { clientId: '', type: 'yoga', date: '', time: '09:00 AM', duration: 60, repeat: 'none', meetLink: '', notes: '' }

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T12:00')
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function StatusBadge({ status }) {
  return <span className={`${styles.badge} ${styles['badge_' + status]}`}>{status}</span>
}
function TypeBadge({ type }) {
  return <span className={`${styles.typeBadge} ${styles['type_' + type]}`}>{type}</span>
}

export default function SessionScheduler() {
  const {
    sessions, addSession, updateSession, cancelSession, completeSession, rescheduleSession,
    rescheduleRequests, approveReschedule, rejectReschedule,
    instructorAvailability, updateInstructorAvailability,
  } = useYogaSessionStore()

  const [statusFilter, setStatusFilter] = useState('all')
  const [clientFilter, setClientFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState(null)

  const [rescheduleModal, setRescheduleModal] = useState(null)
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [rescheduleTime, setRescheduleTime] = useState('09:00 AM')
  const [rescheduleError, setRescheduleError] = useState('')

  const [completeModal, setCompleteModal] = useState(null)
  const [completeNotes, setCompleteNotes] = useState('')

  const [rejectModal, setRejectModal] = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  const [showAvailability, setShowAvailability] = useState(false)
  const [toast, setToast] = useState(null)
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4000)
  }

  const today = new Date().toISOString().split('T')[0]

  const pendingRequests = useMemo(() => rescheduleRequests.filter(r => r.status === 'pending'), [rescheduleRequests])

  const filtered = useMemo(() => {
    return sessions
      .filter((s) => statusFilter === 'all' || s.status === statusFilter)
      .filter((s) => clientFilter === 'all' || s.clientId === clientFilter)
      .filter((s) => typeFilter === 'all' || s.type === typeFilter)
      .sort((a, b) => (a.date + a.time) > (b.date + b.time) ? -1 : 1)
  }, [sessions, statusFilter, clientFilter, typeFilter])

  const stats = useMemo(() => ({
    total: sessions.length,
    scheduled: sessions.filter((s) => s.status === 'scheduled').length,
    completed: sessions.filter((s) => s.status === 'completed').length,
    cancelled: sessions.filter((s) => s.status === 'cancelled').length,
  }), [sessions])

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true) }
  const openEdit = (sess) => {
    setForm({ clientId: sess.clientId, type: sess.type, date: sess.date, time: sess.time, duration: sess.duration, repeat: sess.repeat, meetLink: sess.meetLink, notes: sess.notes })
    setEditId(sess.id); setShowForm(true)
  }
  const handleFormChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.clientId || !form.date || !form.time) return
    const client = CLIENTS.find((c) => c.id === form.clientId)
    const sessionData = { ...form, clientName: client?.name ?? form.clientId, duration: Number(form.duration) }
    if (editId) { updateSession(editId, sessionData) } else { addSession(sessionData) }
    setShowForm(false); setForm(EMPTY_FORM); setEditId(null)
  }

  const handleReschedule = () => {
    if (!rescheduleDate || !rescheduleTime) return
    const result = rescheduleSession(rescheduleModal.id, rescheduleDate, rescheduleTime)
    if (!result.ok) {
      if (result.reason === 'LIMIT_EXCEEDED') setRescheduleError(`Reschedule limit of ${result.max}/month exceeded.`)
      else if (result.reason === 'NOTICE_PERIOD') setRescheduleError(`Minimum ${result.hours}h notice required.`)
      else setRescheduleError('Cannot reschedule this session.')
      return
    }
    setRescheduleModal(null); setRescheduleError('')
  }

  const handleComplete = () => { completeSession(completeModal.id, completeNotes); setCompleteModal(null); setCompleteNotes('') }

  const handleApprove = (req) => {
    approveReschedule(req.id)
    showToast(`✓ Approved — ${req.clientName}'s session moved to ${formatDate(req.requestedDate)} at ${req.requestedTime}`)
  }
  const handleReject = () => {
    if (!rejectModal) return
    rejectReschedule(rejectModal.id, rejectReason)
    setRejectModal(null); setRejectReason('')
    showToast(`✕ Rejected — ${rejectModal.clientName}'s request has been declined`, 'error')
  }

  const openReschedule = (sess) => { setRescheduleModal(sess); setRescheduleDate(sess.date); setRescheduleTime(sess.time); setRescheduleError('') }

  return (
    <div className={styles.page}>
      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${styles['toast_' + toast.type]}`}>
          <span>{toast.msg}</span>
          <button type="button" className={styles.toastClose} onClick={() => setToast(null)}>✕</button>
        </div>
      )}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.heading}>Session Scheduler</h1>
          <p className={styles.sub}>Schedule yoga &amp; exercise sessions, manage recurring bookings.</p>
        </div>
        <div className={styles.headerActions}>
          <button type="button" className={`${styles.newBtn} ${styles.availBtn}`} onClick={() => setShowAvailability(v => !v)}>
            🕐 Availability
          </button>
          <button type="button" className={styles.newBtn} onClick={openCreate}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Session
          </button>
        </div>
      </div>

      {/* Instructor Availability Settings */}
      {showAvailability && (
        <div className={styles.availSection}>
          <div className={styles.availHeader}>
            <h3 className={styles.availTitle}>Instructor Availability</h3>
            <p className={styles.availSub}>Set your available days and time ranges. Users can only reschedule into these slots.</p>
          </div>
          <div className={styles.availGrid}>
            {DAYS.map(day => {
              const cfg = instructorAvailability[day]
              return (
                <div key={day} className={`${styles.availDay} ${cfg.enabled ? '' : styles.availDayOff}`}>
                  <label className={styles.availDayLabel}>
                    <input type="checkbox" checked={cfg.enabled} onChange={e => updateInstructorAvailability(day, { enabled: e.target.checked })} />
                    <span>{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                  </label>
                  {cfg.enabled && (
                    <div className={styles.availTimes}>
                      <select value={cfg.start} onChange={e => updateInstructorAvailability(day, { start: e.target.value })} className={styles.availSelect}>
                        {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <span className={styles.availTo}>to</span>
                      <select value={cfg.end} onChange={e => updateInstructorAvailability(day, { end: e.target.value })} className={styles.availSelect}>
                        {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Pending Reschedule Requests */}
      {pendingRequests.length > 0 && (
        <div className={styles.pendingSection}>
          <div className={styles.pendingHeader}>
            <span className={styles.pendingTitle}>⏳ Pending Reschedule Requests</span>
            <span className={styles.pendingCount}>{pendingRequests.length}</span>
          </div>
          <div className={styles.pendingList}>
            {pendingRequests.map(req => (
              <div key={req.id} className={styles.pendingCard}>
                <div className={styles.pendingCardBody}>
                  <div className={styles.pendingClient}>
                    <div className={styles.avatar}>{req.clientName[0]}</div>
                    <div>
                      <span className={styles.clientName}>{req.clientName}</span>
                      <TypeBadge type={req.sessionType} />
                    </div>
                  </div>
                  <div className={styles.pendingTimes}>
                    <div className={styles.timeBlock}>
                      <span className={styles.timeLabel}>Current</span>
                      <span className={styles.timeValue}>{formatDate(req.originalDate)} · {req.originalTime}</span>
                    </div>
                    <span className={styles.arrow}>→</span>
                    <div className={styles.timeBlock}>
                      <span className={`${styles.timeLabel} ${styles.timeLabelNew}`}>Requested</span>
                      <span className={`${styles.timeValue} ${styles.timeValueNew}`}>{formatDate(req.requestedDate)} · {req.requestedTime}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.pendingActions}>
                  <button type="button" className={styles.approveBtn} onClick={() => handleApprove(req)}>✓ Approve</button>
                  <button type="button" className={styles.rejectBtn} onClick={() => { setRejectModal(req); setRejectReason('') }}>✕ Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className={styles.statsRow}>
        {[
          { label: 'Total Sessions', value: stats.total, color: 'blue' },
          { label: 'Upcoming', value: stats.scheduled, color: 'green' },
          { label: 'Completed', value: stats.completed, color: 'gray' },
          { label: 'Cancelled', value: stats.cancelled, color: 'red' },
        ].map((s) => (
          <div key={s.label} className={`${styles.statCard} ${styles['stat_' + s.color]}`}>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className={styles.filterRow}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Status</label>
          <select className={styles.filterSelect} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {STATUS_FILTER_OPTS.map((o) => <option key={o} value={o}>{o === 'all' ? 'All Statuses' : o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Client</label>
          <select className={styles.filterSelect} value={clientFilter} onChange={(e) => setClientFilter(e.target.value)}>
            <option value="all">All Clients</option>
            {CLIENTS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Type</label>
          <select className={styles.filterSelect} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">All Types</option>
            <option value="yoga">Yoga</option>
            <option value="exercise">Exercise</option>
          </select>
        </div>
        <span className={styles.filterCount}>{filtered.length} session{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Session list */}
      <div className={styles.sessionList}>
        {filtered.length === 0 && (
          <div className={styles.empty}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="36" height="36" style={{ color: '#d1d5db' }}>
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <p>No sessions match the current filters.</p>
          </div>
        )}
        {filtered.map((sess) => (
          <div key={sess.id} className={styles.sessionCard}>
            <div className={styles.cardLeft}><div className={styles.avatar}>{sess.clientName[0]}</div></div>
            <div className={styles.cardBody}>
              <div className={styles.cardTopRow}>
                <span className={styles.clientName}>{sess.clientName}</span>
                <TypeBadge type={sess.type} />
                <StatusBadge status={sess.status} />
                {sess.repeat === 'weekly' && <span className={styles.repeatBadge}>↻ Weekly</span>}
                {sess.pendingRescheduleId && <span className={styles.pendingBadge}>⏳ Pending Reschedule</span>}
              </div>
              <div className={styles.cardMeta}>
                <span>📅 {formatDate(sess.date)}</span>
                <span>⏰ {sess.time}</span>
                <span>⏱ {sess.duration} min</span>
                {sess.rescheduleHistory.length > 0 && <span className={styles.rescheduledTag}>Rescheduled ×{sess.rescheduleHistory.length}</span>}
              </div>
              {!sess.agreementAccepted && <p className={styles.noAgreement}>⚠ Agreement not yet accepted by client</p>}
              {sess.notes && <p className={styles.notes}>{sess.notes}</p>}
            </div>
            <div className={styles.cardActions}>
              {sess.meetLink && <a href={sess.meetLink} target="_blank" rel="noreferrer" className={styles.meetBtn}>Join</a>}
              {sess.status === 'scheduled' && (
                <>
                  <button type="button" className={styles.actionBtn} onClick={() => openEdit(sess)}>Edit</button>
                  <button type="button" className={styles.actionBtn} onClick={() => openReschedule(sess)}>Reschedule</button>
                  <button type="button" className={styles.actionBtn} onClick={() => { setCompleteModal(sess); setCompleteNotes('') }}>Complete</button>
                  <button type="button" className={`${styles.actionBtn} ${styles.actionBtnDanger}`} onClick={() => cancelSession(sess.id)}>Cancel</button>
                </>
              )}
              {sess.status === 'completed' && <button type="button" className={styles.actionBtn} onClick={() => openEdit(sess)}>Notes</button>}
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showForm && (
        <div className={styles.overlay} onClick={() => setShowForm(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <p className={styles.modalTitle}>{editId ? 'Edit Session' : 'Schedule New Session'}</p>
              <button type="button" className={styles.modalClose} onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className={styles.modalBody}>
              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Client *</label>
                  <select name="clientId" className={styles.input} value={form.clientId} onChange={handleFormChange} required>
                    <option value="">Select client…</option>
                    {CLIENTS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Session Type *</label>
                  <select name="type" className={styles.input} value={form.type} onChange={handleFormChange}>
                    {TYPE_OPTS.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Date *</label>
                  <input type="date" name="date" className={styles.input} value={form.date} min={today} onChange={handleFormChange} required />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Time *</label>
                  <select name="time" className={styles.input} value={form.time} onChange={handleFormChange}>
                    {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Duration (min)</label>
                  <select name="duration" className={styles.input} value={form.duration} onChange={handleFormChange}>
                    {DURATION_OPTS.map((d) => <option key={d} value={d}>{d} min</option>)}
                  </select>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Repeat</label>
                  <select name="repeat" className={styles.input} value={form.repeat} onChange={handleFormChange}>
                    {REPEAT_OPTS.map((r) => <option key={r} value={r}>{r === 'none' ? 'One-time' : 'Weekly'}</option>)}
                  </select>
                </div>
                <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>Zoom / Meet Link</label>
                  <input type="url" name="meetLink" className={styles.input} value={form.meetLink} onChange={handleFormChange} placeholder="https://zoom.us/j/..." />
                </div>
                <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>Notes</label>
                  <textarea name="notes" className={`${styles.input} ${styles.textarea}`} value={form.notes} onChange={handleFormChange} placeholder="Session notes…" rows={3} />
                </div>
              </div>
              {!editId && form.repeat === 'weekly' && <p className={styles.recurringNote}>📅 This will create 4 weekly sessions starting from the selected date.</p>}
              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className={styles.submitBtn}>{editId ? 'Save Changes' : 'Schedule Session'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Modal (admin direct) */}
      {rescheduleModal && (
        <div className={styles.overlay} onClick={() => { setRescheduleModal(null); setRescheduleError('') }}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <p className={styles.modalTitle}>Reschedule Session — {rescheduleModal.clientName}</p>
              <button type="button" className={styles.modalClose} onClick={() => { setRescheduleModal(null); setRescheduleError('') }}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.rescheduleInfo}>Current: <strong>{formatDate(rescheduleModal.date)}</strong> at <strong>{rescheduleModal.time}</strong></p>
              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>New Date *</label>
                  <input type="date" className={styles.input} value={rescheduleDate} min={today} onChange={(e) => setRescheduleDate(e.target.value)} />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>New Time *</label>
                  <select className={styles.input} value={rescheduleTime} onChange={(e) => setRescheduleTime(e.target.value)}>
                    {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              {rescheduleError && <p className={styles.errorMsg}>{rescheduleError}</p>}
            </div>
            <div className={styles.modalFooter}>
              <button type="button" className={styles.cancelBtn} onClick={() => { setRescheduleModal(null); setRescheduleError('') }}>Cancel</button>
              <button type="button" className={styles.submitBtn} onClick={handleReschedule}>Confirm Reschedule</button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Modal */}
      {completeModal && (
        <div className={styles.overlay} onClick={() => setCompleteModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <p className={styles.modalTitle}>Mark Session Complete</p>
              <button type="button" className={styles.modalClose} onClick={() => setCompleteModal(null)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.rescheduleInfo}>{completeModal.clientName} · {formatDate(completeModal.date)} · {completeModal.time}</p>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Session Notes (optional)</label>
                <textarea className={`${styles.input} ${styles.textarea}`} value={completeNotes} onChange={(e) => setCompleteNotes(e.target.value)} placeholder="Add notes about this session…" rows={4} />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button type="button" className={styles.cancelBtn} onClick={() => setCompleteModal(null)}>Cancel</button>
              <button type="button" className={styles.submitBtn} onClick={handleComplete}>Mark Complete</button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className={styles.overlay} onClick={() => setRejectModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <p className={styles.modalTitle}>Reject Reschedule Request</p>
              <button type="button" className={styles.modalClose} onClick={() => setRejectModal(null)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.rescheduleInfo}>
                <strong>{rejectModal.clientName}</strong> wants to move from{' '}
                <strong>{formatDate(rejectModal.originalDate)} {rejectModal.originalTime}</strong> to{' '}
                <strong>{formatDate(rejectModal.requestedDate)} {rejectModal.requestedTime}</strong>
              </p>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Reason for rejection (visible to client)</label>
                <textarea className={`${styles.input} ${styles.textarea}`} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="e.g. That slot is reserved for another client…" rows={3} />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button type="button" className={styles.cancelBtn} onClick={() => setRejectModal(null)}>Cancel</button>
              <button type="button" className={styles.dangerBtn} onClick={handleReject}>Reject Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
