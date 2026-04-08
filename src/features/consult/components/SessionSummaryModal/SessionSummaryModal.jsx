// SessionSummaryModal — dietitian notes + action checklist + star rating + download
import { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import ModalShell from '../ModalShell/ModalShell'
import styles from './SessionSummaryModal.module.css'

const EMPTY_SUMMARY = {
  notes: '',
  actions: [],
  rating: 0,
}

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0)

  return (
    <div className={styles.stars} role="group" aria-label="Session rating">
      {[1, 2, 3, 4, 5].map((s) => (
        <button key={s} type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          className={`${styles.star} ${(hover || value) >= s ? styles.starFilled : ''}`}
          aria-label={`${s} star${s > 1 ? 's' : ''}`}
        >★</button>
      ))}
    </div>
  )
}

StarRating.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
}

export default function SessionSummaryModal({ onClose, appt, onRate }) {
  const summary = appt?.summary ?? EMPTY_SUMMARY
  const apptId = appt?.id ?? ''
  const apptDate = appt?.date ?? ''
  const apptTime = appt?.time ?? ''
  const dietitian = appt?.dietitian ?? 'Dietitian'
  const initialRating = summary.rating ?? 0

  const [localRating, setLocalRating] = useState({ apptId: '', value: null })
  const dietitianInitial = dietitian.trim().charAt(0).toUpperCase() || '?'

  const effectiveRating = useMemo(() => {
    if (localRating.apptId === apptId && localRating.value !== null) {
      return localRating.value
    }
    return initialRating
  }, [localRating, apptId, initialRating])

  const handleRate = useCallback(async (r) => {
    setLocalRating({ apptId, value: r })
    if (apptId) {
      await onRate?.(apptId, r)
    }
  }, [onRate, apptId])

  const downloadSummary = useCallback(() => {
    const actions = summary.actions ?? []
    const text = [
      `Session Summary - ${apptDate}`,
      `Dietitian: ${dietitian}`,
      '',
      'Notes:',
      summary.notes,
      '',
      'Action Items:',
      ...actions.map((a) => `[${a.done ? 'x' : ' '}] ${a.text}`),
    ].join('\n')

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `session-${apptDate || 'summary'}.txt`; a.click()
    URL.revokeObjectURL(url)
  }, [apptDate, dietitian, summary])

  const actions = useMemo(() => summary.actions ?? [], [summary.actions])

  if (!appt) return null

  return (
    <ModalShell title="Session Summary" onClose={onClose}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.avatar}>{dietitianInitial}</div>
        <div>
          <p className={styles.name}>{dietitian}</p>
          <p className={styles.date}>{apptDate} &bull; {apptTime}</p>
        </div>
      </div>

      {/* Dietitian notes */}
      <div className={styles.notesCard}>
        <p className={styles.sectionLabel}>Dietitian Notes</p>
        <p className={styles.notes}>{summary.notes || 'No notes shared for this session yet.'}</p>
      </div>

      {/* Action items */}
      <div>
        <p className={styles.sectionLabel}>Action Items</p>
        <ul className={styles.actionList}>
          {actions.map((a) => (
            <li key={a.id} className={styles.actionItem}>
              <div className={`${styles.actionCheck} ${a.done ? styles.actionCheckDone : ''}`} aria-hidden="true">
                {a.done && <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="10" height="10"><polyline points="2 6 5 9 10 3" /></svg>}
              </div>
              <span className={`${styles.actionText} ${a.done ? styles.actionTextDone : ''}`}>{a.text}</span>
            </li>
          ))}
          {!actions.length && <li className={styles.emptyItem}>No action items assigned.</li>}
        </ul>
      </div>

      {/* Rating */}
      <div className={styles.ratingSection}>
        <p className={styles.sectionLabel}>Rate this session</p>
        <StarRating value={effectiveRating} onChange={handleRate} />
        {effectiveRating > 0 && <p className={styles.ratedNote}>Thank you for your feedback!</p>}
      </div>

      {/* Download */}
      <button type="button" onClick={downloadSummary} className={styles.downloadBtn}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download Summary
      </button>
    </ModalShell>
  )
}

SessionSummaryModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  appt: PropTypes.shape({
    id: PropTypes.string,
    date: PropTypes.string,
    time: PropTypes.string,
    dietitian: PropTypes.string,
    summary: PropTypes.shape({
      notes: PropTypes.string,
      actions: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          text: PropTypes.string,
          done: PropTypes.bool,
        })
      ),
      rating: PropTypes.number,
    }),
  }),
  onRate: PropTypes.func,
}
