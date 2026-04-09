import { memo, useCallback, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import styles from './MealPhotoUpload.module.css'

const ACCEPTED = 'image/jpeg,image/png,image/webp,image/heic'
const MAX_MB = 10

function MealPhotoUpload({ onFileSelect, preview }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')

  const openPicker = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const process = useCallback((file) => {
    setError('')
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('Please upload an image file.'); return }
    if (file.size > MAX_MB * 1024 * 1024) { setError(`Image must be under ${MAX_MB}MB.`); return }
    onFileSelect(file)
  }, [onFileSelect])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    process(e.dataTransfer.files[0])
  }, [process])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openPicker()
    }
  }, [openPicker])

  const handleInputChange = useCallback((e) => {
    process(e.target.files[0])
  }, [process])

  return (
    <div className={styles.wrap}>
      <div className={styles.info}>
        <h2 className={styles.heading}>Meal Photo</h2>
        <p className={styles.desc}>
          Upload or snap a photo of your meal. Our nutritionists will review it
          to provide accurate feedback.
        </p>
        <button type="button" onClick={openPicker} className={styles.attachBtn}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          Attach Meal Photo
        </button>
        {error && <p className={styles.error} role="alert">{error}</p>}
      </div>

      <div
        className={`${styles.dropZone} ${dragOver ? styles.active : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !preview && openPicker()}
        role="button"
        tabIndex={preview ? -1 : 0}
        aria-label="Upload meal photo"
        onKeyDown={handleKeyDown}
      >
        <input ref={inputRef} type="file" accept={ACCEPTED} className={styles.hiddenInput}
          onChange={handleInputChange} />

        {preview ? (
          <div className={styles.previewWrap}>
            <img src={preview} alt="Meal preview" className={styles.previewImg} />
            <button type="button" onClick={(e) => { e.stopPropagation(); onFileSelect(null) }}
              className={styles.removeBtn} aria-label="Remove photo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ) : (
          <div className={styles.placeholder}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className={styles.placeholderIcon}>
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
              <line x1="20" y1="4" x2="20" y2="10" /><line x1="17" y1="7" x2="23" y2="7" />
            </svg>
          </div>
        )}
      </div>
    </div>
  )
}

MealPhotoUpload.propTypes = {
  onFileSelect: PropTypes.func.isRequired,
  preview: PropTypes.string,
}

export default memo(MealPhotoUpload)
