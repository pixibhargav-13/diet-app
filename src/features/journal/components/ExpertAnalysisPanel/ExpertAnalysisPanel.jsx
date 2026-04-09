import { memo } from 'react'
import PropTypes from 'prop-types'
import styles from './ExpertAnalysisPanel.module.css'

function ExpertAnalysisPanel({ onSubmit, onCancel, submitting, submitted }) {
  return (
    <aside className={styles.panel} aria-label="Expert analysis">
      <h2 className={styles.title}>Expert Analysis</h2>

      {/* Status icon */}
      <div className={styles.iconWrap}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
          <circle cx="16" cy="15" r="2" />
          <path d="M16 13v-1" />
        </svg>
      </div>

      {/* Status text */}
      {submitted ? (
        <>
          <p className={`${styles.statusTitle} ${styles.statusTitleSuccess}`}>
            Submitted for Review
          </p>
          <p className={styles.statusDesc}>
            Your meal has been sent to a nutritionist. You'll receive feedback within 24 hours.
          </p>
        </>
      ) : (
        <>
          <p className={styles.statusTitle}>Pending Expert Review</p>
          <p className={styles.statusDesc}>
            A nutritionist will analyze your photo and details shortly to provide verified nutritional data and professional feedback.
          </p>
        </>
      )}

      {/* Info hint */}
      <div className={styles.hint}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" className={styles.hintIcon}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p className={styles.hintText}>
          Verified logs ensure your progress tracking is as accurate as possible.
        </p>
      </div>

      {/* Actions */}
      {!submitted && (
        <div className={styles.actions}>
          <button type="button" onClick={onSubmit} disabled={submitting} className={styles.submitBtn}>
            {submitting ? 'Submitting…' : 'Submit for Analysis'}
          </button>
          <button type="button" onClick={onCancel} className={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      )}
    </aside>
  )
}

ExpertAnalysisPanel.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
  submitted: PropTypes.bool,
}

export default memo(ExpertAnalysisPanel)
