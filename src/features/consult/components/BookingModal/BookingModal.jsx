// BookingModal — calendar + time slots + appointment type
import PropTypes from 'prop-types'
import { useCallback, useMemo } from 'react'
import ModalShell from '../ModalShell/ModalShell'
import styles from './BookingModal.module.css'

const today = new Date().toISOString().split('T')[0]
const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const BOOKING_TYPES = ['Regular', 'Emergency']

function toDateString(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function MiniCalendar({ selectedDate, onSelect }) {
  const viewMonthDate = useMemo(() => new Date(selectedDate || today), [selectedDate])
  const year = viewMonthDate.getFullYear()
  const month = viewMonthDate.getMonth()

  const monthName = useMemo(
    () => viewMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' }),
    [viewMonthDate]
  )

  const cells = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const next = []

    for (let i = 0; i < firstDay; i += 1) {
      next.push({ key: `empty-${year}-${month}-${i}`, day: null })
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const dateIso = toDateString(year, month, day)
      next.push({
        key: dateIso,
        day,
        dateIso,
        isPast: dateIso <= today,
        isSelected: dateIso === selectedDate,
      })
    }

    return next
  }, [year, month, selectedDate])

  const handlePrevMonth = useCallback(() => {
    const prev = new Date(year, month - 1, 1)
    onSelect?.(toDateString(prev.getFullYear(), prev.getMonth(), 1))
  }, [year, month, onSelect])

  const handleNextMonth = useCallback(() => {
    const next = new Date(year, month + 1, 1)
    onSelect?.(toDateString(next.getFullYear(), next.getMonth(), 1))
  }, [year, month, onSelect])

  return (
    <div className={styles.calendar}>
      <div className={styles.calNav}>
        <button type="button" onClick={handlePrevMonth} className={styles.calNavBtn} aria-label="Previous month">‹</button>
        <span className={styles.calMonth}>{monthName}</span>
        <button type="button" onClick={handleNextMonth} className={styles.calNavBtn} aria-label="Next month">›</button>
      </div>
      <div className={styles.calGrid}>
        {WEEK_DAYS.map((d) => (
          <span key={d} className={styles.calDayName}>{d}</span>
        ))}
        {cells.map((cell) => (
          <button
            key={cell.key} type="button"
            disabled={!cell.day || cell.isPast}
            onClick={() => {
              if (!cell.day || cell.isPast) return
              onSelect?.(cell.dateIso)
            }}
            className={`${styles.calDay}
              ${!cell.day ? styles.calEmpty : ''}
              ${cell.day && !cell.isPast ? styles.calAvail : ''}
              ${cell.day && cell.isPast ? styles.calPast : ''}
              ${cell.day && cell.isSelected ? styles.calSelected : ''}`}
          >
            {cell.day}
          </button>
        ))}
      </div>
    </div>
  )
}

MiniCalendar.propTypes = { selectedDate: PropTypes.string, onSelect: PropTypes.func }

export default function BookingModal({ onClose, bookDate, changeBookDate, bookSlots, bookSlot, setBookSlot, bookType, setBookType, booking, bookDone, onConfirm }) {
  const handleSelectDate = useCallback((date) => {
    if (!date) return
    changeBookDate?.(date)
  }, [changeBookDate])

  const handleChooseSlot = useCallback((slot) => {
    if (!slot.available) return
    setBookSlot?.(slot.time)
  }, [setBookSlot])

  const handleTypeChange = useCallback((type) => {
    setBookType?.(type)
  }, [setBookType])

  if (bookDone) return (
    <ModalShell title="Appointment Booked" onClose={onClose}>
      <div className={styles.successWrap}>
        <div className={styles.successIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <p className={styles.successTitle}>Appointment Confirmed</p>
        <p className={styles.successSub}>Your Google Meet link will be sent by Dr. Smith after confirmation.</p>
        <button type="button" onClick={onClose} className={styles.doneBtn}>Done</button>
      </div>
    </ModalShell>
  )

  return (
    <ModalShell title="Book Appointment" onClose={onClose} wide>
      {/* Type toggle */}
      <div className={styles.typeToggle}>
        {BOOKING_TYPES.map((t) => (
          <button key={t} type="button"
            onClick={() => handleTypeChange(t)}
            className={`${styles.typeBtn} ${bookType === t ? (t === 'Emergency' ? styles.typeBtnEmerg : styles.typeBtnActive) : ''}`}>
            {t}
          </button>
        ))}
      </div>

      <div className={styles.cols}>
        {/* Calendar */}
        <div>
          <p className={styles.sectionLabel}>Select Date</p>
          <MiniCalendar
            selectedDate={bookDate}
            onSelect={handleSelectDate}
          />
        </div>

        {/* Slots */}
        <div>
          <p className={styles.sectionLabel}>Available Times — {bookDate}</p>
          <div className={styles.slotGrid}>
            {bookSlots.map((s) => (
              <button
                key={s.time} type="button"
                disabled={!s.available}
                onClick={() => handleChooseSlot(s)}
                className={`${styles.slot}
                  ${!s.available ? styles.slotUnavail : styles.slotAvail}
                  ${bookSlot === s.time ? styles.slotSelected : ''}`}
              >
                {s.time}
              </button>
            ))}
          </div>

          {/* Package status */}
          <div className={styles.packageBanner}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" className={styles.pkgIcon}>
              <path d="M20 12V22H4V12" /><path d="M22 7H2v5h20V7z" /><path d="M12 22V7" />
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
            </svg>
            <span>4 sessions remaining in your package</span>
          </div>

          {/* Info banner */}
          <div className={styles.infoBanner}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Google Meet link will be sent by your dietitian after confirmation.
          </div>
        </div>
      </div>

      <button type="button" onClick={onConfirm} disabled={!bookSlot || booking} className={styles.confirmBtn}>
        {booking ? 'Booking…' : `Confirm ${bookType} Booking`}
      </button>
    </ModalShell>
  )
}

BookingModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  bookDate: PropTypes.string,
  changeBookDate: PropTypes.func,
  bookSlots: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.string.isRequired,
      available: PropTypes.bool.isRequired,
    })
  ),
  bookSlot: PropTypes.string,
  setBookSlot: PropTypes.func,
  bookType: PropTypes.oneOf(BOOKING_TYPES),
  setBookType: PropTypes.func,
  booking: PropTypes.bool,
  bookDone: PropTypes.bool,
  onConfirm: PropTypes.func,
}
