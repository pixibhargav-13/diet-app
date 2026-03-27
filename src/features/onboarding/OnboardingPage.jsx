// Onboarding shell — auth guard from useAuthStore, step state from useOnboardingStore
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { useOnboardingStore } from '../../store/useOnboardingStore'
import StepIndicator from './components/StepIndicator'
import HealthProfileStep from './steps/HealthProfileStep'
import GoalStep from './steps/GoalStep'
import BmiStep from './steps/BmiStep'
import DocumentStep from './steps/DocumentStep'
import styles from './OnboardingPage.module.css'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { isOnboardingComplete, currentStep, setStep } = useOnboardingStore()

  // Not logged in — back to sign up
  useEffect(() => {
    if (!isAuthenticated) navigate('/signup', { replace: true })
  }, [isAuthenticated, navigate])

  // Already completed onboarding — skip to dashboard
  useEffect(() => {
    if (isOnboardingComplete) navigate('/dashboard', { replace: true })
  }, [isOnboardingComplete, navigate])

  const goNext = () => setStep(currentStep + 1)
  const goBack = () => setStep(currentStep - 1)
  const finish = () => navigate('/dashboard', { replace: true })

  const STEPS = {
    1: <HealthProfileStep onNext={goNext} />,
    2: <GoalStep onNext={goNext} onBack={goBack} />,
    3: <BmiStep onNext={goNext} onBack={goBack} />,
    4: <DocumentStep onBack={goBack} onFinish={finish} />,
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoRow}>
          <span className={styles.logo}>Vitals</span>
          <span className={styles.stepCount}>Step {currentStep} of 4</span>
        </div>
        <StepIndicator current={currentStep} />
        {STEPS[currentStep]}
      </div>
    </div>
  )
}