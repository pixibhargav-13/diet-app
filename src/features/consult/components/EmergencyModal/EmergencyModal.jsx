// EmergencyModal — urgency description + animated status tracker
import PropTypes from 'prop-types'
import { useCallback } from 'react'
import ModalShell from '../ModalShell/ModalShell'
import styles from './EmergencyModal.module.css'

const STEPS = [
  { key: 'pending', label: 'Request Sent', sub: 'Awaiting response' },
  { key: 'accepted', label: 'Request Accepted', sub: 'Dietitian notified' },
  { key: 'sent', label: 'Link Sent', sub: 'Check WhatsApp & email' },
]

function stepIndex(step) { return STEPS.findIndex((s) => s.key === step) }

export default function EmergencyModal({ onClose, urgency, setUrgency, emergStep, emergSending, onSend }) {
  const currentStepIndex = stepIndex(emergStep)

  const handleUrgencyChange = useCallback((event) => {
    setUrgency?.(event.target.value)
  }, [setUrgency])

  const handleSend = useCallback(() => {
    onSend?.()
  }, [onSend])

  const isSendDisabled = !urgency?.trim() || emergSending

  return (
    <ModalShell title="Emergency Consultation" onClose={onClose}>
      {/* Warning banner */}
      <div className={styles.warningBanner}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" className={styles.warnIcon}>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        Emergency consults are for urgent dietary needs. For medical emergencies call 112.
      </div>

      {!emergStep ? (
        /* Request form */
        <>
          <div className={styles.field}>
            <label htmlFor="urgency" className={styles.label}>Describe your urgency</label>
            <textarea id="urgency" rows={4} value={urgency}
              onChange={handleUrgencyChange}
              placeholder="Describe what's happening and why you need urgent support…"
              className={styles.textarea} />
          </div>

          <button type="button" onClick={handleSend} disabled={isSendDisabled} className={styles.emergBtn}>
            {emergSending ? 'Sending…' : 'Send Emergency Request'}
          </button>

          {/* WhatsApp backup */}
          <a href="https://wa.me/1234567890?text=Emergency+consultation+needed" target="_blank" rel="noopener noreferrer" className={styles.waBtn}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
            </svg>
            <span className={styles.waText}>Contact via WhatsApp instead</span>
          </a>
        </>
      ) : (
        /* Status tracker */
        <div className={styles.tracker}>
          <p className={styles.trackerTitle}>Request Status</p>
          <div className={styles.steps}>
            {STEPS.map((s, i) => {
              const done = i <= currentStepIndex
              const isActive = i === currentStepIndex
              return (
                <div key={s.key} className={styles.step}>
                  <div className={styles.stepLeft}>
                    <div className={`${styles.stepDot} ${done ? styles.stepDotDone : ''} ${isActive ? styles.stepDotActive : ''}`}>
                      {done && !isActive && (
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="10" height="10">
                          <polyline points="2 6 5 9 10 3" />
                        </svg>
                      )}
                      {isActive && <div className={styles.stepPulse} />}
                    </div>
                    {i < STEPS.length - 1 && <div className={`${styles.stepLine} ${done ? styles.stepLineDone : ''}`} />}
                  </div>
                  <div className={styles.stepInfo}>
                    <p className={`${styles.stepLabel} ${done ? styles.stepLabelDone : ''}`}>{s.label}</p>
                    <p className={styles.stepSub}>{s.sub}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {emergStep === 'sent' && (
            <div className={styles.linkSentNote}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.59 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z" />
              </svg>
              Your emergency link has been sent to your registered WhatsApp and email.
            </div>
          )}

          <button type="button" onClick={onClose} className={styles.closeTracker}>
            {emergStep === 'sent' ? 'Done' : 'Close'}
          </button>
        </div>
      )}
    </ModalShell>
  )
}

EmergencyModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  urgency: PropTypes.string,
  setUrgency: PropTypes.func,
  emergStep: PropTypes.oneOf(['pending', 'accepted', 'sent', null]),
  emergSending: PropTypes.bool,
  onSend: PropTypes.func.isRequired,
}
