// CheckoutStepper — "STEP 02 OF 03" with coloured progress segments
import PropTypes from 'prop-types'
import styles from './CheckoutStepper.module.css'

const STEPS = ['Review Cart', 'Payment', 'Confirmation']

export default function CheckoutStepper({ current }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.segments}>
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`${styles.seg} ${
              i < current ? styles.segDone : i === current ? styles.segActive : styles.segPending
            }`}
          />
        ))}
      </div>
      <span className={styles.label}>
        Step {String(current + 1).padStart(2, '0')} of {String(STEPS.length).padStart(2, '0')}
      </span>
    </div>
  )
}

CheckoutStepper.propTypes = {
  current: PropTypes.number.isRequired,  // 0-indexed
}
