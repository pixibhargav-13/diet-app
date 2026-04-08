// ConsultPage — single route /dashboard/consult
// All 5 screens implemented as modals over this page
import { useConsultations } from './hooks/useConsultations'
import AppointmentCard   from './components/AppointmentCard/AppointmentCard'
import BookingModal      from './components/BookingModal/BookingModal'
import { PreConsultModal }    from './components/PreConsultModal/PreConsultModal'
import MeetLinkModal     from './components/MeetLinkModal/MeetLinkModal'
import SessionSummaryModal from './components/SessionSummaryModal/SessionSummaryModal'
import EmergencyModal    from './components/EmergencyModal/EmergencyModal'
import styles from './ConsultPage.module.css'

export default function ConsultPage() {
  const c = useConsultations()

  return (
    <div className={styles.page}>

      {/* Page header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.heading}>Consultations</h1>
          <p className={styles.subheading}>Manage your dietitian appointments and session history.</p>
        </div>
        <div className={styles.headerActions}>
          <button type="button" onClick={c.openEmergency} className={styles.emergBtn}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            Emergency Consult
          </button>
          <button type="button" onClick={c.openBook} className={styles.bookBtn}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Book Appointment
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs} role="tablist">
        {['upcoming', 'past'].map((t) => (
          <button key={t} role="tab" type="button"
            onClick={() => c.setActiveTab(t)}
            className={`${styles.tab} ${c.activeTab === t ? styles.tabActive : ''}`}
            aria-selected={c.activeTab === t}
          >
            {t === 'upcoming' ? 'Upcoming' : 'Past'}{' '}
            <span className={styles.tabCount}>
              {t === 'upcoming' ? c.upcoming.length : c.past.length}
            </span>
          </button>
        ))}
      </div>

      {/* Appointment list */}
      <div className={styles.list}>
        {c.activeTab === 'upcoming' && (
          c.upcoming.length === 0 ? (
            <div className={styles.empty}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="36" height="36" className={styles.emptyIcon}>
                <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <p className={styles.emptyTitle}>No upcoming appointments</p>
              <p className={styles.emptyDesc}>Book a session with your dietitian to get started.</p>
              <button type="button" onClick={c.openBook} className={styles.emptyBtn}>Book Appointment</button>
            </div>
          ) : (
            c.upcoming.map((appt) => (
              <AppointmentCard key={appt.id} appt={appt}
                onPreForm={c.openPreForm}
                onMeet={c.openMeet}
                onSummary={c.openSummary}
              />
            ))
          )
        )}
        {c.activeTab === 'past' && (
          c.past.length === 0 ? (
            <div className={styles.empty}>
              <p className={styles.emptyTitle}>No past appointments yet</p>
            </div>
          ) : (
            c.past.map((appt) => (
              <AppointmentCard key={appt.id} appt={appt} onSummary={c.openSummary} />
            ))
          )
        )}
      </div>

      {/* ── Modals ── */}
      {c.bookingOpen && (
        <BookingModal
          onClose={() => c.setBookingOpen(false)}
          bookDate={c.bookDate} changeBookDate={c.changeBookDate}
          bookSlots={c.bookSlots} bookSlot={c.bookSlot} setBookSlot={c.setBookSlot}
          bookType={c.bookType} setBookType={c.setBookType}
          booking={c.booking} bookDone={c.bookDone} onConfirm={c.confirmBooking}
        />
      )}
      {c.preFormOpen && (
        <PreConsultModal
          onClose={() => c.setPreFormOpen(false)}
          concerns={c.concerns} setConcerns={c.setConcerns}
          dietChange={c.dietChange} setDietChange={c.setDietChange}
          meds={c.meds} setMeds={c.setMeds}
          labFiles={c.labFiles} setLabFiles={c.setLabFiles}
          submitting={c.submitting} onSubmit={c.submitPreForm}
        />
      )}
      {c.meetOpen && (
        <MeetLinkModal onClose={() => c.setMeetOpen(false)} appt={c.focusedAppt} />
      )}
      {c.summaryOpen && (
        <SessionSummaryModal onClose={() => c.setSummaryOpen(false)} appt={c.focusedAppt} onRate={c.submitRating} />
      )}
      {c.emergencyOpen && (
        <EmergencyModal
          onClose={() => c.setEmergencyOpen(false)}
          urgency={c.urgency} setUrgency={c.setUrgency}
          emergStep={c.emergStep} emergSending={c.emergSending} onSend={c.sendEmergency}
        />
      )}
    </div>
  )
}
