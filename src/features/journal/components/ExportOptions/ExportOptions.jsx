// ExportOptions — export panel card + health tip card
// Shared: reusable in any journal page needing export + tip
import PropTypes from 'prop-types'
import styles from './ExportOptions.module.css'

export default function ExportOptions({ tip, onExportPdf }) {
  return (
    <>
      {/* Export options card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={styles.cardIcon}>
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          <h3 className={styles.cardTitle}>Export Options</h3>
        </div>

        <button type="button" onClick={onExportPdf} className={styles.exportRow}>
          <div className={styles.exportIconWrap}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={styles.pdfIcon}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <span className={styles.exportLabel}>PDF Document</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.chevron}>
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Health tip card */}
      {tip && (
        <div className={styles.tipCard}>
          <div className={styles.tipIconWrap}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={styles.tipIcon}>
              <line x1="12" y1="2" x2="12" y2="6" />
              <line x1="12" y1="18" x2="12" y2="22" />
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
              <line x1="2" y1="12" x2="6" y2="12" />
              <line x1="18" y1="12" x2="22" y2="12" />
              <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
              <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
            </svg>
          </div>
          <h4 className={styles.tipTitle}>Health Tip</h4>
          <p className={styles.tipText}>{tip}</p>
        </div>
      )}
    </>
  )
}

ExportOptions.propTypes = {
  tip:         PropTypes.string,
  onExportPdf: PropTypes.func.isRequired,
}
