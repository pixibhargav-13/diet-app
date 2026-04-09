// AppointmentCard — upcoming or past appointment row
import PropTypes from 'prop-types'
import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './AppointmentCard.module.css'

const BADGE_CLASS_BY_STATUS = {
  Confirmed: styles.badgeConfirmed,
  Pending: styles.badgePending,
  Completed: styles.badgeCompleted,
}

export default function AppointmentCard({ appt, onPreForm, onMeet, onSummary }) {
  const [copied, setCopied] = useState(false)
  const copyResetTimerRef = useRef(null)

  const {
    date,
    time,
    dietitian,
    specialty,
    type,
    status,
    meetLink,
  } = appt

  useEffect(() => {
    return () => {
      if (copyResetTimerRef.current) {
        clearTimeout(copyResetTimerRef.current)
      }
    }
  }, [])

  const handleCopyLink = useCallback(async () => {
    if (!meetLink || !navigator?.clipboard?.writeText) return

    try {
      await navigator.clipboard.writeText(`https://${meetLink}`)
      setCopied(true)

      if (copyResetTimerRef.current) {
        clearTimeout(copyResetTimerRef.current)
      }
      copyResetTimerRef.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }, [meetLink])

  const handleOpenMeet = useCallback(() => {
    onMeet?.(appt)
  }, [onMeet, appt])

  const handleOpenPreForm = useCallback(() => {
    onPreForm?.(appt)
  }, [onPreForm, appt])

  const handleOpenSummary = useCallback(() => {
    onSummary?.(appt)
  }, [onSummary, appt])

  const initial = dietitian?.trim()?.charAt(0)?.toUpperCase() || '?'
  const isPast = status === 'Completed'
  const badgeClass = BADGE_CLASS_BY_STATUS[status] ?? styles.badgePending
  const hasMeetLink = Boolean(meetLink)


  return (
    <div className={styles.card}>
      {/* Top row */}
      <div className={styles.top}>
        <div className={styles.dateBlock}>
          <span className={styles.date}>{date}</span>
          <span className={styles.time}>{time}</span>
        </div>
        <span className={`${styles.badge} ${badgeClass}`}>
          {status}
        </span>
      </div>

      {/* Dietitian info */}
      <div className={styles.dietitian}>
        <div className={styles.avatar}>{initial}</div>
        <div>
          <p className={styles.dietitianName}>{dietitian}</p>
          {specialty && <p className={styles.specialty}>{specialty}</p>}
        </div>
        <span className={`${styles.typePill} ${type === 'Emergency' ? styles.typePillEmerg : ''}`}>
          {type}
        </span>
      </div>

      {/* Meet link */}
      {hasMeetLink && (
        <div className={styles.meetRow}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={styles.meetIcon}>
            <path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.867v6.266a1 1 0 0 1-1.447.936L15 14M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" />
          </svg>
          <span className={styles.meetLink}>{meetLink}</span>
          <button type="button" onClick={handleCopyLink} className={styles.copyBtn} aria-label="Copy link">
            {copied
              ? <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" /></svg>
              : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
            }
          </button>
          <button type="button" onClick={handleOpenMeet} className={styles.viewMeetBtn}>
            Join
          </button>
        </div>
      )}

      {/* Actions */}
      <div className={styles.actions}>
        {!isPast && !hasMeetLink && (
          <button type="button" onClick={handleOpenPreForm} className={styles.actionBtn}>
            Pre-consultation Form
          </button>
        )}
        {!isPast && hasMeetLink && (
          <button type="button" onClick={handleOpenMeet} className={styles.actionBtnPrimary}>
            View Session Details
          </button>
        )}
        {isPast && (
          <button type="button" onClick={handleOpenSummary} className={styles.actionBtn}>
            View Summary
          </button>
        )}
      </div>
    </div>
  )
}

AppointmentCard.propTypes = {
  appt: PropTypes.shape({
    id: PropTypes.string,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    dietitian: PropTypes.string.isRequired,
    specialty: PropTypes.string,
    type: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['Confirmed', 'Pending', 'Completed']).isRequired,
    meetLink: PropTypes.string,
  }).isRequired,
  onPreForm: PropTypes.func,
  onMeet: PropTypes.func,
  onSummary: PropTypes.func,
}
