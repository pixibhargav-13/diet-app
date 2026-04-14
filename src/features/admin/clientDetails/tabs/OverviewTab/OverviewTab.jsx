// OverviewTab — health conditions, dietary preferences, current assigned plan
import PropTypes from 'prop-types'
import styles from './OverviewTab.module.css'

const CONDITIONS_ICONS = {
  'Type 2 Diabetes': '🩸',
  'Hypertension':    '❤️',
  'High Cholesterol':'💊',
  'PCOS':            '🔬',
  'Thyroid':         '⚕️',
  'None':            '✅',
}

export default function OverviewTab({ client }) {
  return (
    <div className={styles.wrap}>

      {/* ── Row 1: Conditions + Dietary Prefs ── */}
      <div className={styles.row2}>

        {/* Health conditions */}
        <div className={styles.card}>
          <p className={styles.cardLabel}>Health Conditions</p>
          <div className={styles.tagGrid}>
            {client.conditions.length === 0 ? (
              <span className={styles.none}>None reported</span>
            ) : (
              client.conditions.map((c) => (
                <span key={c} className={styles.conditionTag}>
                  <span className={styles.conditionEmoji}>{CONDITIONS_ICONS[c] ?? '•'}</span>
                  {c}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Dietary preferences */}
        <div className={styles.card}>
          <p className={styles.cardLabel}>Dietary Preferences</p>
          <div className={styles.tagGrid}>
            {client.dietaryPrefs.map((d) => (
              <span key={d} className={styles.dietTag}>{d}</span>
            ))}
          </div>
          {client.allergies.length > 0 && (
            <>
              <p className={styles.subLabel}>Allergies / Intolerances</p>
              <div className={styles.tagGrid}>
                {client.allergies.map((a) => (
                  <span key={a} className={styles.allergyTag}>{a}</span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Row 2: Assigned plan + quick stats ── */}
      <div className={styles.row2}>

        {/* Current plan */}
        <div className={styles.card}>
          <div className={styles.cardHeaderRow}>
            <p className={styles.cardLabel}>Assigned Diet Plan</p>
            {client.assignedPlan ? (
              <span className={styles.planActiveBadge}>Active</span>
            ) : (
              <span className={styles.planNoneBadge}>None</span>
            )}
          </div>
          {client.assignedPlan ? (
            <div className={styles.planInfo}>
              <p className={styles.planName}>{client.assignedPlan}</p>
              <p className={styles.planMeta}>Assigned {client.planAssignedDate} · Version {client.planVersion}</p>
              <div className={styles.planStats}>
                <div className={styles.planStat}>
                  <span className={styles.planStatValue}>{client.planCalories}</span>
                  <span className={styles.planStatLabel}>kcal/day</span>
                </div>
                <div className={styles.planStat}>
                  <span className={styles.planStatValue}>{client.planMeals}</span>
                  <span className={styles.planStatLabel}>meals/day</span>
                </div>
                <div className={styles.planStat}>
                  <span className={styles.planStatValue}>{client.planDuration}</span>
                  <span className={styles.planStatLabel}>weeks</span>
                </div>
              </div>
            </div>
          ) : (
            <p className={styles.noplan}>No plan assigned yet. Use "Assign Diet Plan" above.</p>
          )}
        </div>

        {/* Body snapshot */}
        <div className={styles.card}>
          <p className={styles.cardLabel}>Body Snapshot</p>
          <div className={styles.bodyGrid}>
            {[
              { label: 'Height',       value: `${client.heightCm} cm`  },
              { label: 'Weight',       value: `${client.weightKg} kg`  },
              { label: 'BMI',          value: client.bmi                },
              { label: 'Target Weight',value: `${client.targetWeightKg} kg` },
              { label: 'Blood Group',  value: client.bloodGroup         },
              { label: 'Activity Level', value: client.activityLevel    },
            ].map((s) => (
              <div key={s.label} className={styles.bodyItem}>
                <span className={styles.bodyItemLabel}>{s.label}</span>
                <span className={styles.bodyItemValue}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

OverviewTab.propTypes = {
  client: PropTypes.shape({
    conditions:       PropTypes.arrayOf(PropTypes.string).isRequired,
    dietaryPrefs:     PropTypes.arrayOf(PropTypes.string).isRequired,
    allergies:        PropTypes.arrayOf(PropTypes.string).isRequired,
    assignedPlan:     PropTypes.string,
    planAssignedDate: PropTypes.string,
    planVersion:      PropTypes.number,
    planCalories:     PropTypes.number,
    planMeals:        PropTypes.number,
    planDuration:     PropTypes.number,
    heightCm:         PropTypes.number.isRequired,
    weightKg:         PropTypes.number.isRequired,
    bmi:              PropTypes.number.isRequired,
    targetWeightKg:   PropTypes.number.isRequired,
    bloodGroup:       PropTypes.string.isRequired,
    activityLevel:    PropTypes.string.isRequired,
  }).isRequired,
}
