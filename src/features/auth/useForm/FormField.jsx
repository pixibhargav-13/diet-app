// Reusable controlled input field with label + error message
import PropTypes from 'prop-types'
import styles from './FormField.module.css'

export default function FormField({ id, label, type = 'text', placeholder, required, registration, error, autoComplete }) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span className={styles.required} aria-hidden="true"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        {...registration}
      />
      {error && (
        <p id={`${id}-error`} className={styles.errorMsg} role="alert">
          {error.message}
        </p>
      )}
    </div>
  )
}

FormField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  registration: PropTypes.object,
  error: PropTypes.object,
  autoComplete: PropTypes.string,
}