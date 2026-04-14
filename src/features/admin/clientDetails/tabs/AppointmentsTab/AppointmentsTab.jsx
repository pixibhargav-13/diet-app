// AppointmentsTab — upcoming + past consultation sessions
import { useState } from 'react'
import styles from './AppointmentsTab.module.css'

const MOCK_APPTS = [
  { id:'a1', date:'Nov 18, 2024', time:'10:00 AM', type:'Regular Consult',  duration:'45 min', status:'confirmed', meetSent: true,  notes: 'Progress check and plan adjustment' },
  { id:'a2', date:'Dec 2, 2024',  time:'11:30 AM', type:'Follow-Up',        duration:'30 min', status:'pending',   meetSent: false, notes: '' },
  { id:'a3', date:'Nov 5, 2024',  time:'09:00 AM', type:'Regular Consult',  duration:'45 min', status:'completed', meetSent: true,  notes: 'Reviewed CBC results and updated plan.' },
  { id:'a4', date:'Oct 22, 2024', time:'03:00 PM', type:'Diet Plan Review', duration:'60 min', status:'completed', meetSent: true,  notes: 'Revised meal plan — reduced carbs at dinner.' },
  { id:'a5', date:'Oct 8, 2024',  time:'11:00 AM', type:'Onboarding',       duration:'60 min', status:'completed', meetSent: true,  notes: 'Initial assessment and goal setting.' },
]

const STATUS_MAP = {
  confirmed: { cls: 'confirmed', label: 'Confirmed'  },
  pending:   { cls: 'pending',   label: 'Pending'    },
  completed: { cls: 'completed', label: 'Completed'  },
  cancelled: { cls: 'cancelled', label: 'Cancelled'  },
}

export default function AppointmentsTab() {
  const [activeTab, setActiveTab] = useState('upcoming')

  const upcoming = MOCK_APPTS.filter((a) => a.status === 'confirmed' || a.status === 'pending')
  const past     = MOCK_APPTS.filter((a) => a.status === 'completed' || a.status === 'cancelled')

  const list = activeTab === 'upcoming' ? upcoming : past

  return (
    <div className={styles.wrap}>

      {/* Tab toggle */}
      <div className={styles.tabRow}>
        <button type="button" onClick={() => setActiveTab('upcoming')}
          className={`${styles.tabBtn} ${activeTab === 'upcoming' ? styles.tabBtnActive : ''}`}
          aria-pressed={activeTab === 'upcoming'}
        >
          Upcoming
          <span className={`${styles.tabCount} ${activeTab === 'upcoming' ? styles.tabCountActive : ''}`}>{upcoming.length}</span>
        </button>
        <button type="button" onClick={() => setActiveTab('past')}
          className={`${styles.tabBtn} ${activeTab === 'past' ? styles.tabBtnActive : ''}`}
          aria-pressed={activeTab === 'past'}
        >
          Past
          <span className={`${styles.tabCount} ${activeTab === 'past' ? styles.tabCountActive : ''}`}>{past.length}</span>
        </button>
      </div>

      {/* Appointment cards */}
      <div className={styles.apptList}>
        {list.length === 0 ? (
          <p className={styles.empty}>No {activeTab} appointments.</p>
        ) : (
          list.map((appt) => {
            const s = STATUS_MAP[appt.status] ?? STATUS_MAP.pending
            return (
              <div key={appt.id} className={`${styles.apptCard} ${styles[`card_${s.cls}`]}`}>
                <div className={styles.apptLeft}>
                  <div className={styles.dateBlock}>
                    <span className={styles.apptDate}>{appt.date}</span>
                    <span className={styles.apptTime}>{appt.time}</span>
                  </div>
                  <div className={styles.apptInfo}>
                    <div className={styles.apptTitleRow}>
                      <span className={styles.apptType}>{appt.type}</span>
                      <span className={`${styles.statusBadge} ${styles[s.cls]}`}>{s.label}</span>
                    </div>
                    <span className={styles.apptMeta}>{appt.duration}</span>
                    {appt.notes && <p className={styles.apptNotes}>{appt.notes}</p>}
                  </div>
                </div>

                <div className={styles.apptActions}>
                  {activeTab === 'upcoming' && (
                    <>
                      {appt.meetSent ? (
                        <span className={styles.meetSentBadge}>
                          <svg viewBox="0 0 20 20" fill="currentColor" width="11" height="11"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" /></svg>
                          Link Sent
                        </span>
                      ) : (
                        <button type="button" className={styles.sendLinkBtn}>
                          Send Meet Link
                        </button>
                      )}
                    </>
                  )}
                  {activeTab === 'past' && (
                    <button type="button" className={styles.summaryBtn}>
                      View Summary
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

    </div>
  )
}
