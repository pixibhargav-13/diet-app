// MeetLinkModal — session details, prominent meet link, countdown if within 24h
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import ModalShell from '../ModalShell/ModalShell'
import styles from './MeetLinkModal.module.css'

function parseAppointmentDateTime(date, time) {
  if (!date || !time) return null

  const [timePart, period] = time.trim().split(/\s+/)
  if (!timePart || !period) return null

  const [hoursRaw, minutesRaw] = timePart.split(':')
  let hours = Number(hoursRaw)
  const minutes = Number(minutesRaw)
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null

  const marker = period.toUpperCase()
  if (marker === 'PM' && hours !== 12) hours += 12
  if (marker === 'AM' && hours === 12) hours = 0

  const iso = `${date}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`
  const value = new Date(iso)
  return Number.isNaN(value.getTime()) ? null : value
}

function Countdown({ targetDate }) {
  const calc = useCallback(() => {
    const diff = targetDate.getTime() - Date.now()
    if (diff <= 0) return null

    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    const s = Math.floor((diff % 60000) / 1000)
    return { h, m, s }
  }, [targetDate])

  const [time, setTime] = useState(() => calc())

  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000)
    return () => clearInterval(t)
  }, [calc])

  if (!time) return <span className={styles.countdownDone}>Session time has passed</span>

  return (
    <div className={styles.countdown}>
      <div className={styles.countdownChip}><span className={styles.countdownNum}>{String(time.h).padStart(2, '0')}</span><span className={styles.countdownLbl}>hrs</span></div>
      <span className={styles.countdownSep}>:</span>
      <div className={styles.countdownChip}><span className={styles.countdownNum}>{String(time.m).padStart(2, '0')}</span><span className={styles.countdownLbl}>min</span></div>
      <span className={styles.countdownSep}>:</span>
      <div className={styles.countdownChip}><span className={styles.countdownNum}>{String(time.s).padStart(2, '0')}</span><span className={styles.countdownLbl}>sec</span></div>
    </div>
  )
}

Countdown.propTypes = { targetDate: PropTypes.instanceOf(Date).isRequired }

export default function MeetLinkModal({ onClose, appt }) {
  const [copied, setCopied] = useState(false)
  const [nowMs, setNowMs] = useState(() => Date.now())
  const resetTimerRef = useRef(null)

  const sessionDateTime = useMemo(
    () => parseAppointmentDateTime(appt?.date, appt?.time),
    [appt?.date, appt?.time]
  )

  const meetsUrl = useMemo(() => {
    const link = appt?.meetLink || ''
    if (!link) return ''
    return /^https?:\/\//i.test(link) ? link : `https://${link}`
  }, [appt?.meetLink])

  const statusLabel = appt?.status || 'Confirmed'
  const initial = appt?.dietitian?.trim()?.charAt(0)?.toUpperCase() || '?'

  useEffect(() => {
    const intervalId = setInterval(() => setNowMs(Date.now()), 60000)
    return () => clearInterval(intervalId)
  }, [])

  const within24h = useMemo(() => {
    if (!sessionDateTime) return false
    const diff = sessionDateTime.getTime() - nowMs
    return diff > 0 && diff <= 86400000
  }, [sessionDateTime, nowMs])

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
    }
  }, [])

  const handleCopy = useCallback(async () => {
    if (!meetsUrl || !navigator?.clipboard?.writeText) return

    try {
      await navigator.clipboard.writeText(meetsUrl)
      setCopied(true)
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
      resetTimerRef.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }, [meetsUrl])

  if (!appt) return null

  return (
    <ModalShell title="Session Details" onClose={onClose}>
      {/* Session header */}
      <div className={styles.sessionInfo}>
        <div className={styles.avatar}>{initial}</div>
        <div>
          <p className={styles.dietitianName}>{appt.dietitian}</p>
          <p className={styles.sessionTime}>{appt.date} &bull; {appt.time}</p>
        </div>
        <span className={styles.statusBadge}>{statusLabel}</span>
      </div>

      {/* Countdown — only if within 24h */}
      {within24h && (
        <div className={styles.countdownSection}>
          <p className={styles.countdownTitle}>Session starts in</p>
          <Countdown key={sessionDateTime.getTime()} targetDate={sessionDateTime} />
        </div>
      )}

      {/* Meet link card */}
      <div className={styles.meetCard}>
        <div className={styles.meetCardTop}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" className={styles.videoIcon}>
            <path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.867v6.266a1 1 0 0 1-1.447.936L15 14M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" />
          </svg>
          <span className={styles.meetTitle}>Google Meet Link</span>
        </div>
        <div className={styles.linkRow}>
          <span className={styles.linkText}>{appt.meetLink}</span>
          <button type="button" onClick={handleCopy} className={styles.copyBtn}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <a href={meetsUrl} target="_blank" rel="noopener noreferrer" className={styles.openBtn}>
          Open in Google Meet →
        </a>
      </div>

      {/* WhatsApp note */}
      <div className={styles.whatsappNote}>
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" className={styles.waIcon}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>
        Link was also sent via WhatsApp
      </div>
    </ModalShell>
  )
}

MeetLinkModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  appt: PropTypes.shape({
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    dietitian: PropTypes.string.isRequired,
    meetLink: PropTypes.string,
    status: PropTypes.string,
  }),
}
