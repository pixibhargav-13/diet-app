// GroceryItem — single grocery item with checkbox, name, note, quantity
// Shared: reusable in any list context
import PropTypes from 'prop-types'
import styles from './GroceryItem.module.css'

export default function GroceryItem({ id, name, note, quantity, checked, onToggle }) {
  return (
    <div
      className={`${styles.row} ${checked ? styles.rowChecked : ''}`}
      onClick={() => onToggle(id)}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && onToggle(id)}
    >
      {/* Custom checkbox */}
      <div className={`${styles.checkbox} ${checked ? styles.checkboxChecked : ''}`} aria-hidden="true">
        {checked && (
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="11" height="11">
            <polyline points="2 6 5 9 10 3" />
          </svg>
        )}
      </div>

      {/* Name + note */}
      <div className={styles.info}>
        <span className={`${styles.name} ${checked ? styles.nameChecked : ''}`}>{name}</span>
        {note && <span className={styles.note}>{note}</span>}
      </div>

      {/* Quantity badge */}
      <span className={`${styles.qty} ${checked ? styles.qtyChecked : ''}`}>{quantity}</span>
    </div>
  )
}

GroceryItem.propTypes = {
  id:       PropTypes.string.isRequired,
  name:     PropTypes.string.isRequired,
  note:     PropTypes.string,
  quantity: PropTypes.string.isRequired,
  checked:  PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
}
