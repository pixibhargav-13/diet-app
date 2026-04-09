// OrderSummary — dark right-panel showing price breakdown + promo code input
import { useState } from 'react'
import PropTypes from 'prop-types'
import styles from './OrderSummary.module.css'

export default function OrderSummary({ subtotal, handling, onPromoApply }) {
  const [promo, setPromo] = useState('')
  const [applied, setApplied] = useState(false)
  const [promoErr, setPromoErr] = useState('')
  const total = subtotal + handling

  const handleApply = () => {
    if (!promo.trim()) { setPromoErr('Enter a promo code'); return }
    setPromoErr('')
    onPromoApply?.(promo.trim())
    setApplied(true)
  }

  return (
    <div className={styles.card}>
      <p className={styles.title}>Order Summary</p>

      <div className={styles.lines}>
        <div className={styles.line}>
          <span className={styles.lineLabel}>Subtotal</span>
          <span className={styles.lineVal}>${subtotal.toFixed(2)}</span>
        </div>
        <div className={styles.line}>
          <span className={styles.lineLabel}>Medical Handling</span>
          <span className={styles.lineVal}>${handling.toFixed(2)}</span>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>Total Amount</span>
        <span className={styles.totalVal}>${total.toFixed(2)}</span>
      </div>

      {/* Promo code */}
      <div className={styles.promoRow}>
        <input
          type="text"
          value={promo}
          onChange={(e) => { setPromo(e.target.value); setPromoErr(''); setApplied(false) }}
          placeholder="Promo Code"
          className={`${styles.promoInput} ${promoErr ? styles.promoInputErr : ''}`}
          disabled={applied}
          aria-label="Promo code"
        />
        <button type="button" onClick={handleApply} disabled={applied} className={styles.promoBtn}>
          {applied ? '✓' : 'Apply'}
        </button>
      </div>
      {promoErr && <p className={styles.promoErr} role="alert">{promoErr}</p>}
      {applied && <p className={styles.promoOk}>Promo code applied!</p>}
    </div>
  )
}

OrderSummary.propTypes = {
  subtotal: PropTypes.number.isRequired,
  handling: PropTypes.number.isRequired,
  onPromoApply: PropTypes.func,
}
