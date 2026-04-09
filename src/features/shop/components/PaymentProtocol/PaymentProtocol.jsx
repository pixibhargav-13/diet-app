// PaymentProtocol — payment method selection + Place Order button
import { useState } from 'react'
import PropTypes from 'prop-types'
import styles from './PaymentProtocol.module.css'

const METHODS = [
  { id: 'upi',  label: 'UPI',              sub: 'Instant Verification',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    )
  },
  { id: 'cod',  label: 'Cash on Delivery', sub: 'Pay Upon Arrival',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="12" cy="12" r="2" />
        <path d="M6 12h.01M18 12h.01" />
      </svg>
    )
  },
]

export default function PaymentProtocol({ onPlaceOrder, placing }) {
  const [selected, setSelected] = useState('upi')

  return (
    <div className={styles.section}>
      <p className={styles.title}>Payment Protocol</p>

      <div className={styles.methods}>
        {METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setSelected(m.id)}
            className={`${styles.methodCard} ${selected === m.id ? styles.methodCardActive : ''}`}
            aria-pressed={selected === m.id}
          >
            <div className={`${styles.methodIconWrap} ${selected === m.id ? styles.methodIconActive : ''}`}>
              {m.icon}
            </div>
            <div className={styles.methodInfo}>
              <span className={styles.methodLabel}>{m.label}</span>
              <span className={styles.methodSub}>{m.sub}</span>
            </div>
            {/* Radio indicator */}
            <div className={`${styles.radio} ${selected === m.id ? styles.radioFilled : ''}`}>
              {selected === m.id && <div className={styles.radioDot} />}
            </div>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onPlaceOrder(selected)}
        disabled={placing}
        className={styles.placeOrderBtn}
      >
        {placing ? 'Processing…' : 'Place Order'}
        {!placing && (
          <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
            <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      <p className={styles.sslNote}>
        <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
          <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
        </svg>
        Secure SSL Encrypted Checkout
      </p>
    </div>
  )
}

PaymentProtocol.propTypes = {
  onPlaceOrder: PropTypes.func.isRequired,
  placing:      PropTypes.bool,
}
