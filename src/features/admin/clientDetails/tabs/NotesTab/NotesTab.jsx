// NotesTab — follow-up notes + compliance score history
import { useState } from 'react'
import styles from './NotesTab.module.css'

const MOCK_NOTES = [
  { id:'n1', date:'Nov 12, 2024', note:'Client is responding well to the Mediterranean diet adjustments. Reduce carb intake for dinner. Schedule follow-up in 2 weeks.', compliance: 88, author:'Dr. N. Shah' },
  { id:'n2', date:'Oct 28, 2024', note:'Discussed meal timing issues. Client skipping breakfast 3x/week. Added morning protein smoothie to plan to improve consistency.', compliance: 71, author:'Dr. N. Shah' },
  { id:'n3', date:'Oct 14, 2024', note:'Initial assessment complete. Blood sugar slightly elevated. Starting low-GI diet protocol. Advised against processed carbohydrates.', compliance: 62, author:'Dr. N. Shah' },
  { id:'n4', date:'Sep 30, 2024', note:'Onboarding session. Client motivated, clear goals. BMI 29.8 — target 26. Diet history reviewed. Allergen profile documented.', compliance: null, author:'Dr. N. Shah' },
]

export default function NotesTab() {
  const [draft,    setDraft]    = useState('')
  const [saving,   setSaving]   = useState(false)
  const [notes,    setNotes]    = useState(MOCK_NOTES)

  const handleSave = async () => {
    if (!draft.trim()) return
    setSaving(true)
    await new Promise((r) => setTimeout(r, 600))
    setNotes([{
      id:         `n${Date.now()}`,
      date:       new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      note:       draft.trim(),
      compliance: null,
      author:     'Dr. N. Shah',
    }, ...notes])
    setDraft('')
    setSaving(false)
  }

  return (
    <div className={styles.wrap}>

      {/* Add note */}
      <div className={styles.addCard}>
        <p className={styles.addLabel}>Add Follow-Up Note</p>
        <textarea
          rows={3}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Enter clinical notes, dietary adjustments, observations…"
          className={styles.addTextarea}
        />
        <button type="button" onClick={handleSave} disabled={saving || !draft.trim()} className={styles.saveBtn}>
          {saving ? 'Saving…' : 'Save Note'}
        </button>
      </div>

      {/* Compliance trend mini-strip */}
      <div className={styles.complianceStrip}>
        <p className={styles.stripLabel}>Compliance History</p>
        <div className={styles.stripBars}>
          {notes.filter((n) => n.compliance != null).slice(0, 6).reverse().map((n, i) => (
            <div key={i} className={styles.stripItem}>
              <div
                className={styles.stripBar}
                style={{
                  height: `${n.compliance}%`,
                  background: n.compliance >= 80 ? '#4a7c59' : n.compliance >= 60 ? '#d4a72c' : '#c44545',
                }}
                title={`${n.compliance}% on ${n.date}`}
              />
              <span className={styles.stripVal}>{n.compliance}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Notes list */}
      <div className={styles.notesList}>
        {notes.map((n) => (
          <div key={n.id} className={styles.noteCard}>
            <div className={styles.noteHeader}>
              <div className={styles.noteLeft}>
                <span className={styles.noteDate}>{n.date}</span>
                <span className={styles.noteAuthor}>{n.author}</span>
              </div>
              {n.compliance != null && (
                <div className={`${styles.compBadge}
                  ${n.compliance >= 80 ? styles.compHigh : n.compliance >= 60 ? styles.compMed : styles.compLow}`
                }>
                  {n.compliance}% compliant
                </div>
              )}
            </div>
            <p className={styles.noteBody}>{n.note}</p>
          </div>
        ))}
      </div>

    </div>
  )
}
