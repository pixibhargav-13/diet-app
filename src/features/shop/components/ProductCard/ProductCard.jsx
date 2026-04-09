// ProductCard — product card with qty controls, no wishlist
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import styles from './ProductCard.module.css'

function StarIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
    </svg>
  )
}

export default function ProductCard({ product, qty, onAdd, onIncrease, onDecrease }) {
  const navigate = useNavigate()
  const inCart = qty > 0

  const openProductDetails = () => {
    navigate(`/dashboard/shop/${product.id}`)
  }

  const handleCardKeyDown = (event) => {
    if (event.target !== event.currentTarget) return
    if (event.key !== 'Enter' && event.key !== ' ') return

    event.preventDefault()
    openProductDetails()
  }

  const handleActionClick = (event, action) => {
    event.stopPropagation()
    action()
  }

  return (
    <div
      className={styles.card}
      role="link"
      tabIndex={0}
      aria-label={`Open details for ${product.name}`}
      onClick={openProductDetails}
      onKeyDown={handleCardKeyDown}
    >
      {/* Image */}
      <div className={styles.imgWrap}>
        <img src={product.img} alt={product.name} className={styles.img} />
      </div>

      {/* Info */}
      <div className={styles.info}>
        {/* Rating */}
        <div className={styles.ratingRow}>
          <span className={styles.star}><StarIcon /></span>
          <span className={styles.ratingVal}>{product.rating}</span>
          <span className={styles.ratingCount}>({product.reviews} reviews)</span>
        </div>

        {/* Name + descriptor */}
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.descriptor}>{product.descriptor}</p>

        {/* Price + cart */}
        <div className={styles.footer}>
          <span className={styles.price}>${product.price.toFixed(2)}</span>

          {inCart ? (
            /* Quantity controls */
            <div className={styles.qtyControls}>
              <button type="button" onClick={(event) => handleActionClick(event, () => onDecrease(product.id))} className={styles.qtyBtn} aria-label="Decrease quantity">
                <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                  <path fillRule="evenodd" d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10Z" clipRule="evenodd" />
                </svg>
              </button>
              <span className={styles.qtyNum}>{qty}</span>
              <button type="button" onClick={(event) => handleActionClick(event, () => onIncrease(product.id))} className={styles.qtyBtn} aria-label="Increase quantity">
                <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                  <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                </svg>
              </button>
            </div>
          ) : (
            /* Add to cart */
            <button type="button" onClick={(event) => handleActionClick(event, () => onAdd(product.id))} className={styles.addBtn} aria-label={`Add ${product.name} to cart`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    descriptor: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    reviews: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    img: PropTypes.string.isRequired,
  }).isRequired,
  qty: PropTypes.number.isRequired,
  onAdd: PropTypes.func.isRequired,
  onIncrease: PropTypes.func.isRequired,
  onDecrease: PropTypes.func.isRequired,
}
