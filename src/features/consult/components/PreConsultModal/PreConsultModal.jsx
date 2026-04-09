// PreConsultModal — 3 text areas + file upload
import { useCallback, useId, useRef } from 'react'
import PropTypes from 'prop-types'
import ModalShell from '../ModalShell/ModalShell'
import styles from './PreConsultModal.module.css'

export function PreConsultModal({ onClose, concerns, setConcerns, dietChange, setDietChange, meds, setMeds, labFiles, setLabFiles, submitting, onSubmit }) {
  const fileInputRef = useRef(null)
  const concernsId = useId()
  const dietChangeId = useId()
  const medsId = useId()
  const fileInputId = useId()

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFiles = useCallback((files) => {
    if (!files?.length) return

    const allowed = Array.from(files).filter((file) => file.type.startsWith('image/') || file.type === 'application/pdf')
    if (!allowed.length) return

    setLabFiles((prev) => {
      const existing = new Set(prev.map((entry) => `${entry.name}-${entry.size}`))
      const next = [...prev]

      allowed.forEach((file) => {
        const key = `${file.name}-${file.size}`
        if (!existing.has(key)) {
          existing.add(key)
          next.push({ name: file.name, size: file.size })
        }
      })

      return next
    })
  }, [setLabFiles])

  const handleRemoveFile = useCallback((index) => {
    setLabFiles((prev) => prev.filter((_, i) => i !== index))
  }, [setLabFiles])

  const handleUploadKeyDown = useCallback((event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openFilePicker()
    }
  }, [openFilePicker])

  return (
    <ModalShell title="Pre-Consultation Form" onClose={onClose}>
      <div className={styles.field}>
        <label htmlFor={concernsId} className={styles.label}>Current Concerns</label>
        <textarea id={concernsId} rows={3} value={concerns} onChange={(e) => setConcerns(e.target.value)} placeholder="Describe your main health concerns this week..." className={styles.textarea} />
      </div>
      <div className={styles.field}>
        <label htmlFor={dietChangeId} className={styles.label}>Recent Diet Changes</label>
        <textarea id={dietChangeId} rows={3} value={dietChange} onChange={(e) => setDietChange(e.target.value)} placeholder="Any changes to your eating habits recently..." className={styles.textarea} />
      </div>
      <div className={styles.field}>
        <label htmlFor={medsId} className={styles.label}>Current Medications / Supplements</label>
        <textarea id={medsId} rows={2} value={meds} onChange={(e) => setMeds(e.target.value)} placeholder="List any medications or supplements you're taking..." className={styles.textarea} />
      </div>

      {/* File upload */}
      <div className={styles.field}>
        <label className={styles.label}>Lab Results <span className={styles.optional}>(optional)</span></label>
        <div className={styles.dropZone} role="button" tabIndex={0} onClick={openFilePicker} onKeyDown={handleUploadKeyDown} aria-controls={fileInputId}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="22" height="22" className={styles.dropIcon}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className={styles.dropText}>Click to upload PDF or images</p>
          <input id={fileInputId} ref={fileInputRef} type="file" accept=".pdf,image/*" multiple className={styles.hiddenInput} onChange={(e) => handleFiles(e.target.files)} />
        </div>
        {labFiles.length > 0 && (
          <ul className={styles.fileList}>
            {labFiles.map((f, index) => (
              <li key={`${f.name}-${f.size}-${index}`} className={styles.fileItem}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                {f.name}
                <button type="button" onClick={() => handleRemoveFile(index)} className={styles.removeFile} aria-label={`Remove ${f.name}`}>x</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button type="button" onClick={onSubmit} disabled={submitting} className={styles.submitBtn}>
        {submitting ? 'Submitting…' : 'Submit Form'}
      </button>
    </ModalShell>
  )
}

PreConsultModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  concerns: PropTypes.string,
  setConcerns: PropTypes.func,
  dietChange: PropTypes.string,
  setDietChange: PropTypes.func,
  meds: PropTypes.string,
  setMeds: PropTypes.func,
  labFiles: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      size: PropTypes.number.isRequired,
    })
  ),
  setLabFiles: PropTypes.func,
  submitting: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
}
