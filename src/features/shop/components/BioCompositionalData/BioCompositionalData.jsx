// BioCompositionalData — ingredient / nutrient table card
import PropTypes from 'prop-types'
import styles from './BioCompositionalData.module.css'

export default function BioCompositionalData({ ingredients }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={styles.headerIcon}>
          <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
        </svg>
        <span className={styles.label}>Bio-Compositional Data</span>
      </div>

      <table className={styles.table}>
        <tbody>
          {ingredients.map((item, i) => (
            <tr key={i} className={styles.row}>
              <td className={styles.name}>{item.name}</td>
              <td className={styles.value}>{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button type="button" className={styles.certLink}>
        View Full Certificate of Analysis
      </button>
    </div>
  )
}

BioCompositionalData.propTypes = {
  ingredients: PropTypes.arrayOf(PropTypes.shape({
    name:   PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
  })).isRequired,
}
