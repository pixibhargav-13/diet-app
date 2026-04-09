// CartItemRow — one item in the cart with qty controls + remove button
import PropTypes from 'prop-types'
import styles from './CartItemRow.module.css'

export default function CartItemRow({ item, onIncrease, onDecrease, onRemove }) {
  const lineTotal = (item.price * item.qty).toFixed(2)

  return (
    <div className={styles.row}>
      {/* Product image */}
      <div className={styles.imgWrap}>
        <img src={item.img} alt={item.name} className={styles.img} />
      </div>

      {/* Info */}
      <div className={styles.info}>
        <h3 className={styles.name}>{item.name}</h3>
        <p className={styles.descriptor}>{item.descriptor}</p>

        {/* Qty controls + remove */}
        <div className={styles.controls}>
          <button type="button" onClick={() => onDecrease(item.id)} className={styles.qtyBtn} aria-label="Decrease">
            <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
              <path fillRule="evenodd" d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10Z" clipRule="evenodd" />
            </svg>
          </button>
          <span className={styles.qty}>{String(item.qty).padStart(2, '0')}</span>
          <button type="button" onClick={() => onIncrease(item.id)} className={styles.qtyBtn} aria-label="Increase">
            <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
          </button>

          <button type="button" onClick={() => onRemove(item.id)} className={styles.removeBtn}>
            <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
              <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5Zm0 1.5h2.5A1.25 1.25 0 0 1 12.5 3.75v.5h-5v-.5A1.25 1.25 0 0 1 8.75 2.5Z" clipRule="evenodd" />
            </svg>
            Remove
          </button>
        </div>
      </div>

      {/* Price + badge */}
      <div className={styles.priceCol}>
        <span className={styles.price}>${lineTotal}</span>
        <span className={`${styles.badge} ${item.badge === 'IN STOCK' ? styles.badgeGreen : styles.badgeBlue}`}>
          {item.badge}
        </span>
      </div>
    </div>
  )
}

CartItemRow.propTypes = {
  item: PropTypes.shape({
    id:         PropTypes.string.isRequired,
    name:       PropTypes.string.isRequired,
    descriptor: PropTypes.string.isRequired,
    price:      PropTypes.number.isRequired,
    qty:        PropTypes.number.isRequired,
    img:        PropTypes.string.isRequired,
    badge:      PropTypes.string.isRequired,
  }).isRequired,
  onIncrease: PropTypes.func.isRequired,
  onDecrease: PropTypes.func.isRequired,
  onRemove:   PropTypes.func.isRequired,
}
