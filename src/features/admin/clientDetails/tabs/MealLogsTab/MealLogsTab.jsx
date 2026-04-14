// MealLogsTab — date-filtered meal entries with photo thumbnails + comment
import { useState, useMemo } from 'react'
import styles from './MealLogsTab.module.css'

const SLOT_COLOR = { Breakfast:'#fff8e1', Lunch:'#eef4fa', Dinner:'#fff0f0', Snacks:'#f5f0ff' }

const MOCK_LOGS = [
  { id:'ml1', date:'2024-11-12', slot:'Breakfast', meal:'Oatmeal with Berries',   kcal:380, photoColor:'#fde68a', comment:'',      reviewed: false },
  { id:'ml2', date:'2024-11-12', slot:'Lunch',     meal:'Grilled Chicken Salad',  kcal:450, photoColor:'#bfdbfe', comment:'Looks balanced. Good protein source.', reviewed: true },
  { id:'ml3', date:'2024-11-12', slot:'Dinner',    meal:'Dal & Brown Rice',        kcal:520, photoColor:'#fecaca', comment:'',      reviewed: false },
  { id:'ml4', date:'2024-11-11', slot:'Breakfast', meal:'Poha with Peanuts',       kcal:310, photoColor:'#fed7aa', comment:'',      reviewed: false },
  { id:'ml5', date:'2024-11-11', slot:'Lunch',     meal:'Paneer Sabzi & Roti',     kcal:490, photoColor:'#bbf7d0', comment:'Portion size is a bit large.', reviewed: true },
  { id:'ml6', date:'2024-11-10', slot:'Dinner',    meal:'Khichdi with Ghee',       kcal:440, photoColor:'#e0e7ff', comment:'',      reviewed: false },
]

function groupByDate(logs) {
  return logs.reduce((acc, l) => {
    if (!acc[l.date]) acc[l.date] = []
    acc[l.date].push(l)
    return acc
  }, {})
}

function formatDate(d) {
  const dt = new Date(d)
  return dt.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
}

export default function MealLogsTab() {
  const [dateFilter, setDateFilter] = useState('')
  const [comments, setComments]     = useState(() =>
    Object.fromEntries(MOCK_LOGS.map((l) => [l.id, l.comment]))
  )
  const [editing, setEditing] = useState(null)

  const filtered = useMemo(() => {
    if (!dateFilter) return MOCK_LOGS
    return MOCK_LOGS.filter((l) => l.date === dateFilter)
  }, [dateFilter])

  const grouped = useMemo(() => groupByDate(filtered), [filtered])

  return (
    <div className={styles.wrap}>

      {/* Filter bar */}
      <div className={styles.filterBar}>
        <div className={styles.dateWrap}>
          <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" className={styles.dateIcon}>
            <path fillRule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Z" clipRule="evenodd" />
          </svg>
          <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className={styles.dateInput} aria-label="Filter by date" />
        </div>
        {dateFilter && (
          <button type="button" onClick={() => setDateFilter('')} className={styles.clearDate}>
            Clear filter
          </button>
        )}
        <span className={styles.logCount}>{filtered.length} entries</span>
      </div>

      {/* Grouped log entries */}
      {Object.keys(grouped).sort((a, b) => b.localeCompare(a)).map((date) => (
        <div key={date} className={styles.dayGroup}>
          <p className={styles.dayLabel}>{formatDate(date)}</p>
          <div className={styles.cardGrid}>
            {grouped[date].map((log) => (
              <div key={log.id} className={styles.logCard}>
                {/* Photo placeholder */}
                <div className={styles.photoWrap} style={{ background: log.photoColor }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className={styles.photoIcon}>
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  {log.reviewed && (
                    <div className={styles.reviewedBadge}>
                      <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" /></svg>
                      Reviewed
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className={styles.logInfo}>
                  <div className={styles.logTopRow}>
                    <span className={styles.slotBadge} style={{ background: SLOT_COLOR[log.slot] ?? '#f3f4f6' }}>
                      {log.slot}
                    </span>
                    <span className={styles.logKcal}>{log.kcal} kcal</span>
                  </div>
                  <p className={styles.logMeal}>{log.meal}</p>

                  {/* Comment / feedback */}
                  {editing === log.id ? (
                    <div className={styles.commentEdit}>
                      <textarea
                        rows={2}
                        value={comments[log.id]}
                        onChange={(e) => setComments((c) => ({ ...c, [log.id]: e.target.value }))}
                        className={styles.commentInput}
                        placeholder="Add dietitian feedback…"
                        autoFocus
                      />
                      <div className={styles.commentActions}>
                        <button type="button" onClick={() => setEditing(null)} className={styles.saveCmt}>Save</button>
                        <button type="button" onClick={() => setEditing(null)} className={styles.cancelCmt}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.commentView}>
                      {comments[log.id] ? (
                        <p className={styles.commentText}>{comments[log.id]}</p>
                      ) : (
                        <p className={styles.commentPlaceholder}>No feedback yet</p>
                      )}
                      <button type="button" onClick={() => setEditing(log.id)} className={styles.editCmt}>
                        {comments[log.id] ? 'Edit' : '+ Add feedback'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {Object.keys(grouped).length === 0 && (
        <p className={styles.empty}>No meal logs found for this date.</p>
      )}
    </div>
  )
}
