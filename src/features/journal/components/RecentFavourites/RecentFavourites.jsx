import { memo } from 'react'
import PropTypes from 'prop-types'
import styles from './RecentFavourites.module.css'

const DEFAULTS = [
  'Greek Yogurt Bowl',
  'Grilled Chicken Salad',
  'Protein Shake',
  'Oats & Banana',
  'Avocado Toast',
]

function RecentFavourites({ items = DEFAULTS, onSelect }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.label}>Recent Favourites</span>
        <button type="button" className={styles.viewAll}>View All</button>
      </div>

      <ul className={styles.row}>
        {items.map((name) => (
          <li key={name} className={styles.chipItem}>
            <button
              type="button"
              className={styles.chip}
              onClick={() => onSelect?.(name)}
              aria-label={`Add ${name}`}
            >
              <span className={styles.plus}>+</span>
              <span className={styles.chipName}>{name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

RecentFavourites.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string),
  onSelect: PropTypes.func,   // (name: string) => void
}

export default memo(RecentFavourites)
