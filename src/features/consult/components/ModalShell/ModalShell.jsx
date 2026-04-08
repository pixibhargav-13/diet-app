// ModalShell — shared overlay + container used by every consult modal
import { useCallback, useEffect, useId } from 'react'
import PropTypes from 'prop-types'
import styles from './ModalShell.module.css'

export default function ModalShell({ title, onClose, children, wide }) {
  const titleId = useId()

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const esc = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', esc)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', esc)
    }
  }, [onClose])

  const handleOverlayClick = useCallback((event) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }, [onClose])

  return (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className={`${styles.modal} ${wide ? styles.wide : ''}`} role="document">
        <div className={styles.header}>
          <h2 id={titleId} className={styles.title}>{title}</h2>
          <button type="button" onClick={onClose} className={styles.closeBtn} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  )
}

ModalShell.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  wide: PropTypes.bool,
}
