// ClientHeader — top section of client detail page
// name, goal, BMI, subscription badge + Assign Diet Plan + WhatsApp buttons
import PropTypes from 'prop-types'
import styles from './ClientHeader.module.css'

const COMPLIANCE_MAP = {
  High:   { cls: 'high',   label: 'High Compliance'   },
  Medium: { cls: 'medium', label: 'Mid Compliance'    },
  Low:    { cls: 'low',    label: 'Low Compliance'    },
}

const SUB_TONE = {
  Premium:  'premium',
  Standard: 'standard',
  Trial:    'trial',
  Expired:  'expired',
}

export default function ClientHeader({ client, onAssignPlan, onWhatsApp }) {
  const initials = client.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  const comp = COMPLIANCE_MAP[client.compliance] ?? COMPLIANCE_MAP.Medium
  const subTone = SUB_TONE[client.subscription] ?? 'standard'
  const isInactive = client.daysInactive >= 3

  return (
    <div className={styles.header}>
      {/* Avatar + core info */}
      <div className={styles.left}>
        <div className={`${styles.avatar} ${isInactive ? styles.avatarInactive : ''}`}>
          {initials}
        </div>

        <div className={styles.info}>
          <div className={styles.nameRow}>
            <h1 className={styles.name}>{client.name}</h1>
            {isInactive && (
              <span className={styles.inactiveBadge}>{client.daysInactive}d inactive</span>
            )}
          </div>
          <p className={styles.email}>{client.email} · {client.phone}</p>

          {/* Quick stat chips */}
          <div className={styles.chips}>
            <span className={styles.chip}>
              <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12" className={styles.chipIcon}>
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v4.59L7.3 9.24a.75.75 0 0 0-1.1 1.02l3.25 3.5a.75.75 0 0 0 1.1 0l3.25-3.5a.75.75 0 1 0-1.1-1.02l-1.95 2.1V6.75Z" clipRule="evenodd" />
              </svg>
              {client.goal}
            </span>
            <span className={styles.chip}>BMI {client.bmi}</span>
            <span className={styles.chip}>{client.age} yrs · {client.gender}</span>
            <span className={`${styles.subChip} ${styles[subTone]}`}>{client.subscription}</span>
            <span className={`${styles.compChip} ${styles[comp.cls]}`}>{comp.label}</span>
          </div>

          {/* Joined + last active */}
          <p className={styles.meta}>
            Joined {client.joinDate}
            <span className={styles.metaDot} />
            Last active <span className={isInactive ? styles.metaAlert : ''}>{client.daysInactive === 0 ? 'Today' : `${client.daysInactive} days ago`}</span>
            <span className={styles.metaDot} />
            Plan: <strong>{client.assignedPlan ?? 'None assigned'}</strong>
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className={styles.actions}>
        <button type="button" onClick={onAssignPlan} className={styles.assignBtn}>
          <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
            <path d="M2.695 14.763l-1.262 3.154a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.885L17.5 5.5a2.121 2.121 0 0 0-3-3L3.58 13.42a4 4 0 0 0-.885 1.343Z" />
          </svg>
          Assign Diet Plan
        </button>
        <button type="button" onClick={onWhatsApp} className={styles.waBtn}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
          Send WhatsApp
        </button>
      </div>
    </div>
  )
}

ClientHeader.propTypes = {
  client: PropTypes.shape({
    name:         PropTypes.string.isRequired,
    email:        PropTypes.string.isRequired,
    phone:        PropTypes.string.isRequired,
    goal:         PropTypes.string.isRequired,
    bmi:          PropTypes.number.isRequired,
    age:          PropTypes.number.isRequired,
    gender:       PropTypes.string.isRequired,
    subscription: PropTypes.string.isRequired,
    compliance:   PropTypes.string.isRequired,
    daysInactive: PropTypes.number.isRequired,
    joinDate:     PropTypes.string.isRequired,
    assignedPlan: PropTypes.string,
  }).isRequired,
  onAssignPlan: PropTypes.func.isRequired,
  onWhatsApp:   PropTypes.func.isRequired,
}
