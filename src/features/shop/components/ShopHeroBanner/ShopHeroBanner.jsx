// ShopHeroBanner — dark hero card at the top of the shop page
import PropTypes from 'prop-types'
import styles from './ShopHeroBanner.module.css'

export default function ShopHeroBanner({ onShopClick }) {
  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <span className={styles.badge}>Seasonal Refresh</span>
        <h1 className={styles.heading}>Elevate Your Internal Sanctuary</h1>
        <p className={styles.desc}>
          Get 20% off all clinical-grade smoothies and immunity boosters.
          Limited time clinical offer.
        </p>
        <button type="button" onClick={onShopClick} className={styles.cta}>
          Shop Collection
        </button>
      </div>
      {/* Abstract decorative blobs — pure CSS, no image required */}
      <div className={styles.deco} aria-hidden="true">
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.blob3} />
      </div>
    </div>
  )
}

ShopHeroBanner.propTypes = { onShopClick: PropTypes.func }
