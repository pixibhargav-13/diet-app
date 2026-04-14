// ShopPage — /dashboard/shop
// Hero banner → product description strip → product cards + wishlist tab
import { useMemo, useRef, useState } from 'react'
import ShopHeroBanner from './components/ShopHeroBanner/ShopHeroBanner'
import ProductCard from './components/ProductCard/ProductCard'
import CartSummaryBar from './components/CartSummaryBar/CartSummaryBar'
import { SHOP_PRODUCTS } from './data/shopData'
import { useShopCartStore } from '../../store/useShopCartStore'
import { useWishlistStore } from '../../store/useWishlistStore'
import styles from './ShopPage.module.css'

export default function ShopPage() {
  const cart = useShopCartStore((state) => state.cartById)
  const addItem = useShopCartStore((state) => state.addItem)
  const increaseItem = useShopCartStore((state) => state.increaseItem)
  const decreaseItem = useShopCartStore((state) => state.decreaseItem)
  const wishlistIds = useWishlistStore((s) => s.ids)
  const productRef = useRef(null)
  const [activeTab, setActiveTab] = useState('all')

  const itemCount = useMemo(
    () => Object.values(cart).reduce((sum, quantity) => sum + quantity, 0),
    [cart]
  )
  const total = useMemo(
    () => SHOP_PRODUCTS.reduce((sum, product) => sum + (cart[product.id] ?? 0) * product.price, 0),
    [cart]
  )

  const wishlistProducts = useMemo(
    () => SHOP_PRODUCTS.filter((p) => wishlistIds.includes(p.id)),
    [wishlistIds]
  )

  const scrollToProducts = () => {
    productRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className={styles.page}>

      {/* Hero */}
      <ShopHeroBanner onShopClick={scrollToProducts} />

      {/* Product section heading */}
      <div className={styles.sectionHeader} ref={productRef}>
        <div>
          <h2 className={styles.sectionTitle}>Our Products</h2>
          <p className={styles.sectionDesc}>
            Clinically-informed formulations designed by nutritionists to support your health goals.
            Each product integrates seamlessly with your personalised diet plan.
          </p>
        </div>
        {itemCount > 0 && (
          <div className={styles.cartBadge}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {itemCount} item{itemCount !== 1 ? 's' : ''} · ${total.toFixed(2)}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === 'all' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Products
        </button>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === 'wishlist' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('wishlist')}
        >
          Wishlist
          {wishlistIds.length > 0 && (
            <span className={styles.tabBadge}>{wishlistIds.length}</span>
          )}
        </button>
      </div>

      {/* Product grid or wishlist */}
      {activeTab === 'all' ? (
        <div className={styles.grid}>
          {SHOP_PRODUCTS.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              qty={cart[p.id] ?? 0}
              onAdd={addItem}
              onIncrease={increaseItem}
              onDecrease={decreaseItem}
            />
          ))}
        </div>
      ) : wishlistProducts.length > 0 ? (
        <div className={styles.grid}>
          {wishlistProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              qty={cart[p.id] ?? 0}
              onAdd={addItem}
              onIncrease={increaseItem}
              onDecrease={decreaseItem}
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyWishlist}>
          <span className={styles.emptyWishlistIcon}>🤍</span>
          <p className={styles.emptyWishlistTitle}>Your wishlist is empty</p>
          <p className={styles.emptyWishlistSub}>Tap the heart icon on any product to save it here.</p>
        </div>
      )}

      {/* Sticky cart bar */}
      <CartSummaryBar itemCount={itemCount} total={total} />

    </div>
  )
}
