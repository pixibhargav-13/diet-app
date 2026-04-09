// CartSummaryBar — sticky bar at bottom of page when cart has items
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import styles from './CartSummaryBar.module.css'

export default function CartSummaryBar({ itemCount, total }) {
  if (itemCount === 0) return null

  return (
    <div className={styles.bar} role="complementary" aria-label="Cart summary">
      <div className={styles.left}>
        <span className={styles.count}>{itemCount} item{itemCount !== 1 ? 's' : ''} in cart</span>
        <span className={styles.total}>${total.toFixed(2)}</span>
      </div>
      <Link to="/dashboard/shop/checkout" className={styles.checkoutBtn}>
        Proceed to Checkout
        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
          <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
        </svg>
      </Link>
    </div>
  )
}

CartSummaryBar.propTypes = {
  itemCount: PropTypes.number.isRequired,
  total:     PropTypes.number.isRequired,
}
