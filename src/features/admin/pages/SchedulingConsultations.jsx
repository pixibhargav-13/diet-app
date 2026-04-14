import { useState } from 'react'
import { CONSULTATIONS, AVAILABLE_SLOTS, BLOCKED_DATES } from '../data/adminMockData'
import styles from './SchedulingConsultations.module.css'

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function buildCalendar(year, month) {
  const first = new Date(year, month, 1).getDay()
  const days = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < first; i++) cells.push(null)
  for (let d = 1; d <= days; d++) cells.push(d)
  return cells
}

function fmt(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export default function SchedulingConsultations() {
  const today = new Date()
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(null)
  const [blocked, setBlocked] = useState(BLOCKED_DATES)
  const [tab, setTab] = useState('upcoming')
  const [slots, setSlots] = useState(AVAILABLE_SLOTS)
  const [newSlot, setNewSlot] = useState('')
  const [noteModal, setNoteModal] = useState(null)
  const [joinSuccess, setJoinSuccess] = useState(null)

  const cells = buildCalendar(calYear, calMonth)
  const monthLabel = new Date(calYear, calMonth).toLocaleDateString('en', { month: 'long', year: 'numeric' })

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear((y) => y - 1); setCalMonth(11) }
    else setCalMonth((m) => m - 1)
  }
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear((y) => y + 1); setCalMonth(0) }
    else setCalMonth((m) => m + 1)
  }

  const toggleBlock = (dateStr) => {
    setBlocked((prev) => prev.includes(dateStr) ? prev.filter((d) => d !== dateStr) : [...prev, dateStr])
  }

  const addSlot = () => {
    if (!selectedDate || !newSlot.trim()) return
    setSlots((prev) => {
      const existing = prev.find((s) => s.date === selectedDate)
      if (existing) return prev.map((s) => s.date === selectedDate ? { ...s, slots: [...s.slots, newSlot.trim()] } : s)
      return [...prev, { date: selectedDate, slots: [newSlot.trim()] }]
    })
    setNewSlot('')
  }

  const selectedSlots = slots.find((s) => s.date === selectedDate)?.slots ?? []
  const upcoming = CONSULTATIONS.filter((c) => c.status === 'Upcoming')
  const past     = CONSULTATIONS.filter((c) => c.status === 'Completed')

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.heading}>Scheduling &amp; Consultations</h1>
          <p className={styles.sub}>Set available slots, manage sessions and join video calls.</p>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Calendar */}
        <div className={styles.calendarCard}>
          <div className={styles.calHeader}>
            <button type="button" className={styles.calNav} onClick={prevMonth}>‹</button>
            <span className={styles.calMonth}>{monthLabel}</span>
            <button type="button" className={styles.calNav} onClick={nextMonth}>›</button>
          </div>
          <div className={styles.calGrid}>
            {DAYS_OF_WEEK.map((d) => <span key={d} className={styles.calDayLabel}>{d}</span>)}
            {cells.map((day, i) => {
              if (!day) return <span key={`e${i}`} />
              const dateStr = fmt(calYear, calMonth, day)
              const isBlocked  = blocked.includes(dateStr)
              const hasSlots   = slots.some((s) => s.date === dateStr)
              const isSelected = selectedDate === dateStr
              const isToday    = dateStr === fmt(today.getFullYear(), today.getMonth(), today.getDate())
              return (
                <button
                  key={dateStr}
                  type="button"
                  className={`${styles.calDay} ${isSelected ? styles.calDaySelected : ''} ${isBlocked ? styles.calDayBlocked : ''} ${hasSlots ? styles.calDayHasSlots : ''} ${isToday ? styles.calDayToday : ''}`}
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                >
                  {day}
                  {hasSlots  && !isBlocked && <span className={styles.dot} />}
                  {isBlocked && <span className={styles.dotBlocked} />}
                </button>
              )
            })}
          </div>
          {/* Legend */}
          <div className={styles.calLegend}>
            <span className={styles.legendItem}><span className={styles.dotGreen} />Available</span>
            <span className={styles.legendItem}><span className={styles.dotRed} />Blocked</span>
          </div>
        </div>

        {/* Slot manager */}
        <div className={styles.slotCard}>
          {selectedDate ? (
            <>
              <div className={styles.slotHeader}>
                <p className={styles.slotTitle}>{new Date(selectedDate + 'T12:00').toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                <button
                  type="button"
                  className={`${styles.blockBtn} ${blocked.includes(selectedDate) ? styles.blockBtnActive : ''}`}
                  onClick={() => toggleBlock(selectedDate)}
                >
                  {blocked.includes(selectedDate) ? 'Unblock Date' : 'Block Date'}
                </button>
              </div>
              {blocked.includes(selectedDate) ? (
                <p className={styles.blockedMsg}>This date is blocked. No sessions can be booked.</p>
              ) : (
                <>
                  <p className={styles.slotSub}>Available slots</p>
                  <div className={styles.slotList}>
                    {selectedSlots.length === 0 && <p className={styles.emptySlot}>No slots added yet.</p>}
                    {selectedSlots.map((s) => (
                      <div key={s} className={styles.slotChip}>{s}</div>
                    ))}
                  </div>
                  <div className={styles.addSlotRow}>
                    <input
                      type="text"
                      className={styles.slotInput}
                      value={newSlot}
                      onChange={(e) => setNewSlot(e.target.value)}
                      placeholder="e.g. 10:00 AM"
                      onKeyDown={(e) => e.key === 'Enter' && addSlot()}
                    />
                    <button type="button" className={styles.addSlotBtn} onClick={addSlot}>Add Slot</button>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className={styles.slotEmpty}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="32" height="32" style={{ color: '#d1d5db' }}>
                <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <p>Select a date on the calendar to manage available slots or block the date.</p>
            </div>
          )}
        </div>
      </div>

      {/* Consultations list */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.tabs}>
            <button type="button" className={`${styles.tabBtn} ${tab === 'upcoming' ? styles.tabBtnActive : ''}`} onClick={() => setTab('upcoming')}>
              Upcoming <span className={styles.tabCount}>{upcoming.length}</span>
            </button>
            <button type="button" className={`${styles.tabBtn} ${tab === 'past' ? styles.tabBtnActive : ''}`} onClick={() => setTab('past')}>
              Past <span className={styles.tabCount}>{past.length}</span>
            </button>
          </div>
        </div>

        <div className={styles.sessionList}>
          {(tab === 'upcoming' ? upcoming : past).map((s) => (
            <div key={s.id} className={styles.sessionRow}>
              <div className={styles.sessionAvatar}>{s.client[0]}</div>
              <div className={styles.sessionInfo}>
                <p className={styles.sessionClient}>{s.client}</p>
                <p className={styles.sessionMeta}>
                  {s.date} · {s.time} · <span className={styles.sessionType}>{s.type}</span>
                </p>
                {s.notes && <p className={styles.sessionNotes}>{s.notes}</p>}
              </div>
              <div className={styles.sessionActions}>
                {s.hasPreForm && (
                  <button type="button" className={styles.preFormBtn} onClick={() => setNoteModal(s)}>
                    Pre-form
                  </button>
                )}
                {tab === 'upcoming' && (
                  <button
                    type="button"
                    className={styles.joinBtn}
                    onClick={() => { setJoinSuccess(s.id); setTimeout(() => setJoinSuccess(null), 2000) }}
                  >
                    {joinSuccess === s.id ? '✓ Joining…' : 'Join Call'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pre-form note modal */}
      {noteModal && (
        <div className={styles.modalOverlay} onClick={() => setNoteModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <p className={styles.modalTitle}>Pre-consultation Notes — {noteModal.client}</p>
              <button type="button" className={styles.modalClose} onClick={() => setNoteModal(null)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.noteField}><strong>Health concerns:</strong> Increased fatigue, irregular periods</p>
              <p className={styles.noteField}><strong>Diet changes:</strong> Started intermittent fasting (16:8) last week</p>
              <p className={styles.noteField}><strong>Medications:</strong> Metformin 500mg, Vitamin D3</p>
              <p className={styles.noteField}><strong>Lab tests:</strong> Reports uploaded on {noteModal.date}</p>
            </div>
            <div className={styles.modalFooter}>
              <button type="button" className={styles.modalCloseBtn} onClick={() => setNoteModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
