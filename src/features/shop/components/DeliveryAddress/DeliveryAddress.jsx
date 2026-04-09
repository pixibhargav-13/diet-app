// DeliveryAddress — saved address card with change button
import PropTypes from 'prop-types'
import styles from './DeliveryAddress.module.css'

export default function DeliveryAddress({ address, onChangeAddress }) {
  const hasAddress = Boolean(address)

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>Delivery Sanctuary</span>
        <button type="button" onClick={onChangeAddress} className={styles.changeBtn}>
          {hasAddress ? 'Change Address' : 'Add Address'}
        </button>
      </div>

      {hasAddress ? (
        <div className={styles.addressCard}>
          <div className={styles.pinWrap} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.pinIcon}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div className={styles.addressInfo}>
            <span className={styles.addressLabel}>{address.label}</span>
            <span className={styles.addressLine}>{address.line1}</span>
            <span className={styles.addressLine}>{address.line2}</span>
            <div className={styles.phoneRow}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12" className={styles.phoneIcon}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span className={styles.phone}>{address.phone}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.emptyAddress}>
          No delivery address selected yet. Add one to continue to payment.
        </div>
      )}
    </div>
  )
}

DeliveryAddress.propTypes = {
  address: PropTypes.shape({
    label: PropTypes.string.isRequired,
    line1: PropTypes.string.isRequired,
    line2: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
  }),
  onChangeAddress: PropTypes.func.isRequired,
}
