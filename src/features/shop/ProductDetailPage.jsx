// ProductDetailPage — /dashboard/shop/:productId
// Two-column hero (image gallery + info panel), bio data, reviews section
import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import ProductImageGallery from './components/ProductImageGallery/ProductImageGallery'
import BioCompositionalData from './components/BioCompositionalData/BioCompositionalData'
import ProductReviews from './components/ProductReviews/ProductReviews'
import { useShopCartStore } from '../../store/useShopCartStore'
import {
  DEFAULT_REVIEW_BREAKDOWN,
  getProductDetail,
  PRODUCT_REVIEWS_BY_ID,
  REVIEW_BREAKDOWN_BY_ID,
} from './data/shopData'
import styles from './ProductDetailPage.module.css'

// ── Stars component (inline for this file) ─────────────────────────────────
function StarRow({ rating }) {
  return (
    <div className={styles.starRow}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} viewBox="0 0 20 20" fill={n <= Math.round(rating) ? '#d4a72c' : '#e5e7eb'} width="15" height="15">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
        </svg>
      ))}
    </div>
  )
}

function ProductDetailContent({ product }) {
  const [qty, setQty] = useState(1)
  const currentQty = useShopCartStore((state) => state.cartById[product.id] ?? 0)
  const addItem = useShopCartStore((state) => state.addItem)
  const increaseItem = useShopCartStore((state) => state.increaseItem)
  const decreaseItem = useShopCartStore((state) => state.decreaseItem)

  const inCart = currentQty > 0

  const addToCart = () => {
    addItem(product.id, qty)
  }

  return (
    <div className={styles.page}>

      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link to="/dashboard/shop" className={styles.bcLink}>Shop</Link>
        <span className={styles.bcSep}>›</span>
        <span className={styles.bcCurrent}>{product.name}</span>
      </nav>

      {/* ── Hero section ── */}
      <div className={styles.hero}>

        {/* Left — image gallery */}
        <div className={styles.galleryCol}>
          <ProductImageGallery images={product.images} name={product.name} />
        </div>

        {/* Right — product info */}
        <div className={styles.infoCol}>
          {/* Badge + SKU */}
          <div className={styles.metaRow}>
            <span className={styles.clinicalBadge}>{product.badge}</span>
            <span className={styles.sku}>SKU: {product.sku}</span>
          </div>

          {/* Name */}
          <h1 className={styles.productName}>{product.name}</h1>

          {/* Price + rating */}
          <div className={styles.priceRow}>
            <span className={styles.price}>${product.price.toFixed(2)}</span>
            <StarRow rating={product.rating} />
            <span className={styles.reviewCount}>({product.reviews} Reviews)</span>
          </div>

          {/* Description */}
          <p className={styles.desc}>{product.desc}</p>

          {/* Qty + stock */}
          <div className={styles.qtyRow}>
            <div className={styles.qtyControls}>
              <button
                type="button"
                onClick={() => (inCart ? decreaseItem(product.id) : setQty((q) => Math.max(1, q - 1)))}
                className={styles.qtyBtn}
                aria-label="Decrease"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fillRule="evenodd" d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10Z" clipRule="evenodd" /></svg>
              </button>
              <span className={styles.qtyNum}>{inCart ? currentQty : qty}</span>
              <button
                type="button"
                onClick={() => (inCart ? increaseItem(product.id) : setQty((q) => q + 1))}
                className={styles.qtyBtn}
                aria-label="Increase"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" /></svg>
              </button>
            </div>
            <div className={styles.stockBadge}>
              <span className={styles.stockDot} />
              In Stock
            </div>
          </div>

          {/* Add to cart */}
          <button type="button" onClick={addToCart} className={`${styles.addToCartBtn} ${inCart ? styles.addToCartBtnDone : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {inCart ? `In Cart: ${currentQty}` : `Add ${qty} to Cart`}
          </button>

          {/* Bio data */}
          <BioCompositionalData ingredients={product.ingredients} />
        </div>
      </div>

      {/* ── Divider ── */}
      <div className={styles.divider} />

      {/* ── Reviews ── */}
      <ProductReviews
        reviews={PRODUCT_REVIEWS_BY_ID[product.id] ?? []}
        rating={product.rating}
        breakdown={REVIEW_BREAKDOWN_BY_ID[product.id] ?? DEFAULT_REVIEW_BREAKDOWN}
      />

      {/* Footer */}
      <p className={styles.footerNote}>HealthFlow Ecosystem &bull; All products third-party lab tested</p>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const { productId } = useParams()
  const product = getProductDetail(productId)

  if (!product) {
    return <Navigate to="/dashboard/shop" replace />
  }

  return <ProductDetailContent key={product.id} product={product} />
}
