// GroceryCategory — collapsible section: icon, category label, list of GroceryItems
// Shared: each category is its own instance
import PropTypes from 'prop-types'
import GroceryItem from '../GroceryItem/GroceryItem'
import styles from './GroceryCategory.module.css'

// Icon per category type
function CategoryIcon({ type }) {
  const map = {
    PROTEINS: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2h18l-2 7H5L3 2z" /><path d="M5 9c0 6 14 6 14 0" />
        <path d="M12 13v8" /><path d="M8 21h8" />
      </svg>
    ),
    VEGETABLES: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 22c1.25-.987 2.27-1.975 3.9-2.2a5.56 5.56 0 0 1 3.8 1.5 4 4 0 0 0 6.187-2.353 3.5 3.5 0 0 0 3.69-5.116A3.5 3.5 0 0 0 20.95 8 3.5 3.5 0 1 0 16 3.05a3.5 3.5 0 0 0-5.831 1.373 3.5 3.5 0 0 0-5.116 3.69 4 4 0 0 0-2.348 6.155C3.499 15.42 3 17.29 2 22z" />
      </svg>
    ),
    'GRAINS & PANTRY': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <path d="M15 22v-4a3 3 0 0 0-3-3v0a3 3 0 0 0-3 3v4" />
        <path d="M2 7h20" />
      </svg>
    ),
    DAIRY: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2h8" /><path d="M9 2v2.789a4 4 0 0 1-.672 2.219l-.656.984A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.789a4 4 0 0 0-.672-2.219l-.656-.984A4 4 0 0 1 15 4.788V2" />
      </svg>
    ),
    FRUITS: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2" />
        <path d="M12 2c0 0-4 4-4 10s4 10 4 10" />
        <path d="M12 2c0 0 4 4 4 10s-4 10-4 10" />
        <path d="M2 12h20" />
      </svg>
    ),
  }

  return (
    <span className={styles.catIcon}>
      {map[type] ?? map.PROTEINS}
    </span>
  )
}

CategoryIcon.propTypes = { type: PropTypes.string.isRequired }

export default function GroceryCategory({ type, items, onToggle }) {
  const allDone = items.every((i) => i.checked)

  return (
    <div className={styles.section}>
      {/* Category heading */}
      <div className={styles.heading}>
        <CategoryIcon type={type} />
        <span className={`${styles.label} ${allDone ? styles.labelDone : ''}`}>{type}</span>
      </div>

      {/* Items */}
      <div className={styles.list}>
        {items.map((item) => (
          <GroceryItem
            key={item.id}
            {...item}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  )
}

GroceryCategory.propTypes = {
  type:     PropTypes.string.isRequired,
  items:    PropTypes.array.isRequired,
  onToggle: PropTypes.func.isRequired,
}
