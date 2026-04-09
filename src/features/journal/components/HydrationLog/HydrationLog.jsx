import { useState } from 'react'
import PropTypes from 'prop-types'
import styles from './HydrationLog.module.css'

function DrinkIcon({ source }) {
  // Water bottle icon
  if (source === 'Water Bottle') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={styles.entryIcon}>
        <path d="M5 2h14l-1.5 18H6.5L5 2z" />
      </svg>
    )
  }
  // Cup / tea icon
  if (source === 'Green Tea') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={styles.entryIcon}>
        <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="2" x2="6" y2="4" />
        <line x1="10" y1="2" x2="10" y2="4" />
        <line x1="14" y1="2" x2="14" y2="4" />
      </svg>
    )
  }
  // Default droplet
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={styles.entryIcon}>
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  )
}

DrinkIcon.propTypes = { source: PropTypes.string }

export default function HydrationLog({ entries, onAddCustom }) {
  const [customMl, setCustomMl] = useState('')
  const [error, setError] = useState('')

  const handleAdd = () => {
    const val = Number(customMl)
    if (!customMl || Number.isNaN(val) || val <= 0) { setError('Enter a valid amount'); return }
    if (val > 5000) { setError('Max 5000ml per entry'); return }
    setError('')
    onAddCustom(val)
    setCustomMl('')
  }

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleAdd() }

  return (
    <div className={styles.panel}>

      {/* Custom volume input */}
      <div className={styles.customSection}>
        <p className={styles.sectionTitle}>Log Custom Volume</p>
        <div className={styles.inputRow}>
          <div className={styles.inputWrap}>
            <input
              type="number"
              min="1" max="5000"
              value={customMl}
              onChange={(e) => { setCustomMl(e.target.value); setError('') }}
              onKeyDown={handleKeyDown}
              placeholder="Enter ml"
              className={`${styles.input} ${error ? styles.inputError : ''}`}
              aria-label="Enter volume in ml"
            />
            <span className={styles.unit}>ml</span>
          </div>
          <button type="button" onClick={handleAdd} className={styles.addBtn}>
            Add
          </button>
        </div>
        {error && <p className={styles.error} role="alert">{error}</p>}
      </div>

      {/* Hourly log */}
      <div className={styles.logSection}>
        <div className={styles.logHeader}>
          <p className={styles.sectionTitle}>Hourly Log</p>
          <button type="button" className={styles.insightsLink}>
            View Detailed Insights
          </button>
        </div>

        <p className={styles.scrollHint}>Scroll to review older hydration entries.</p>

        <div className={styles.entryScrollArea}>
          {entries.length === 0 ? (
            <p className={styles.empty}>No entries yet today.</p>
          ) : (
            <ul className={styles.entryList} role="list" aria-label="Hourly hydration log">
              {entries.map((e) => (
                <li key={e.id} className={styles.entry}>
                  <div className={styles.entryIconWrap}>
                    <DrinkIcon source={e.source} />
                  </div>
                  <div className={styles.entryInfo}>
                    <span className={styles.entryAmount}>{e.ml}ml logged</span>
                    <span className={styles.entrySource}>{e.source}</span>
                  </div>
                  <span className={styles.entryTime}>{e.time}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className={styles.endLabel}>End of Today&apos;s Journal</p>
      </div>

    </div>
  )
}

HydrationLog.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    ml: PropTypes.number.isRequired,
    source: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
  })).isRequired,
  onAddCustom: PropTypes.func.isRequired,  // (ml: number) => void
}
