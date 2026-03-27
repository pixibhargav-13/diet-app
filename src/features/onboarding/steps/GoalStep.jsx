// Step 2 — single goal selection, large clickable cards
import { useState } from 'react'
import PropTypes from 'prop-types'
import { useOnboardingStore } from '../../../store/useOnboardingStore'
import StepLayout from '../components/StepLayout'
import styles from './GoalStep.module.css'

const GOALS = [
  { id: 'weight-loss',         label: 'Weight Loss',         icon: '📉', desc: 'Lose body fat and reach a healthier weight'    },
  { id: 'weight-gain',         label: 'Weight Gain',         icon: '📈', desc: 'Build mass with structured nutrition'           },
  { id: 'muscle-gain',         label: 'Muscle Gain',         icon: '💪', desc: 'Increase strength and lean muscle mass'        },
  { id: 'disease-management',  label: 'Disease Management',  icon: '🩺', desc: 'Manage diabetes, thyroid, PCOD, and more'     },
  { id: 'maintenance',         label: 'Maintenance',         icon: '⚖️', desc: 'Stay at your current weight and feel great'   },
]

export default function GoalStep({ onNext, onBack }) {
  const { goal: saved, setGoal, setStep } = useOnboardingStore()
  const [selected, setSelected] = useState(saved)

  const handleNext = () => {
    setGoal(selected)
    setStep(3)
    onNext()
  }

  return (
    <StepLayout
      heading="What is your goal?"
      subtext="Select one goal — we'll build your entire plan around it."
      onBack={onBack}
      onNext={handleNext}
      nextDisabled={!selected}
    >
      <div className={styles.goalGrid}>
        {GOALS.map((g) => {
          const isSelected = selected === g.id
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => setSelected(g.id)}
              className={`${styles.goalCard} ${isSelected ? styles.goalCardSelected : ''}`}
              aria-pressed={isSelected}
            >
              <span className={styles.goalIcon}>{g.icon}</span>
              <div className={styles.goalText}>
                <span className={styles.goalLabel}>{g.label}</span>
                <span className={styles.goalDesc}>{g.desc}</span>
              </div>
              {/* Selection indicator */}
              <span className={`${styles.radioOuter} ${isSelected ? styles.radioOuterSelected : ''}`}>
                {isSelected && <span className={styles.radioInner} />}
              </span>
            </button>
          )
        })}
      </div>
    </StepLayout>
  )
}

GoalStep.propTypes = {
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
}