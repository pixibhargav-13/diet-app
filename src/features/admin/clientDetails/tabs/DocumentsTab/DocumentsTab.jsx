// DocumentsTab — blood reports, prescriptions — view / download
import { useState } from 'react'
import styles from './DocumentsTab.module.css'

const MOCK_DOCS = [
  { id:'d1', category:'Blood Report',   name:'Complete Blood Count (CBC)',      date:'Nov 5, 2024',  size:'1.2 MB', type:'pdf' },
  { id:'d2', category:'Blood Report',   name:'HbA1c & Fasting Glucose Panel',   date:'Oct 18, 2024', size:'0.8 MB', type:'pdf' },
  { id:'d3', category:'Blood Report',   name:'Lipid Profile',                   date:'Sep 30, 2024', size:'0.9 MB', type:'pdf' },
  { id:'d4', category:'Prescription',   name:'Metformin 500mg — Rx Dr. Gupta', date:'Oct 20, 2024', size:'0.3 MB', type:'pdf' },
  { id:'d5', category:'Prescription',   name:'Thyroid Medication — Rx Dr. Rao',date:'Aug 14, 2024', size:'0.2 MB', type:'pdf' },
  { id:'d6', category:'Lab Report',     name:'Vitamin D & B12 Panel',           date:'Nov 1, 2024',  size:'0.6 MB', type:'pdf' },
]

const CATEGORIES = ['All', 'Blood Report', 'Prescription', 'Lab Report']

const CAT_TONE = { 'Blood Report':'blood', 'Prescription':'rx', 'Lab Report':'lab' }

function DocIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

export default function DocumentsTab() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [previewing,     setPreviewing]      = useState(null)

  const filtered = activeCategory === 'All'
    ? MOCK_DOCS
    : MOCK_DOCS.filter((d) => d.category === activeCategory)

  return (
    <div className={styles.wrap}>

      {/* Category filter */}
      <div className={styles.filterRow}>
        {CATEGORIES.map((c) => (
          <button key={c} type="button" onClick={() => setActiveCategory(c)}
            className={`${styles.catChip} ${activeCategory === c ? styles.catChipActive : ''}`}
            aria-pressed={activeCategory === c}
          >
            {c}
            {c !== 'All' && <span className={styles.catCount}>{MOCK_DOCS.filter((d) => d.category === c).length}</span>}
          </button>
        ))}
      </div>

      {/* Document list */}
      <div className={styles.docList}>
        {filtered.map((doc) => (
          <div key={doc.id} className={styles.docRow}>
            <div className={`${styles.docIconWrap} ${styles[CAT_TONE[doc.category] ?? 'lab']}`}>
              <DocIcon />
            </div>

            <div className={styles.docInfo}>
              <span className={styles.docName}>{doc.name}</span>
              <div className={styles.docMeta}>
                <span className={`${styles.docCatBadge} ${styles[CAT_TONE[doc.category] ?? 'lab']}`}>{doc.category}</span>
                <span className={styles.docDate}>{doc.date}</span>
                <span className={styles.docSize}>{doc.size}</span>
              </div>
            </div>

            <div className={styles.docActions}>
              <button type="button" onClick={() => setPreviewing(doc.id === previewing ? null : doc.id)} className={styles.viewBtn}>
                <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                  <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                  <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41Z" clipRule="evenodd" />
                </svg>
                View
              </button>
              <button type="button" className={styles.downloadBtn}>
                <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                  <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
                  <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
                </svg>
                Download
              </button>
            </div>

            {/* Inline preview placeholder */}
            {previewing === doc.id && (
              <div className={styles.previewPane}>
                <div className={styles.previewPlaceholder}>
                  <DocIcon />
                  <p>Preview for <strong>{doc.name}</strong></p>
                  <p className={styles.previewNote}>PDF viewer integration point — connect to your document storage URL here.</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className={styles.empty}>No documents in this category.</p>
      )}
    </div>
  )
}
