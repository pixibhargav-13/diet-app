import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import StepIndicator from "./components/StepIndicator";
import HealthProfileStep from "./steps/HealthProfileStep";
import GoalStep from "./steps/GoalStep";
import BmiStep from "./steps/BmiStep";
import DocumentStep from "./steps/DocumentStep";
import styles from "./OnboardingPage.module.css";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();
  const { currentStep, setStep } = useOnboardingStore();

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== "/signup") {
      navigate("/signup", { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  useEffect(() => {
    if (user?.onboardingComplete && location.pathname !== "/dashboard") {
      navigate("/dashboard", { replace: true });
    }
  }, [user?.onboardingComplete, location.pathname, navigate]);

  const goNext = () => setStep(currentStep + 1);
  const goBack = () => setStep(currentStep - 1);
  const finish = () => navigate("/dashboard", { replace: true });

  const STEPS = {
    1: <HealthProfileStep onNext={goNext} />,
    2: <GoalStep onNext={goNext} onBack={goBack} />,
    3: <BmiStep onNext={goNext} onBack={goBack} />,
    4: <DocumentStep onBack={goBack} onFinish={finish} />,
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoRow}>
          <span className={styles.logo}>App</span>
          <span className={styles.stepCount}>Step {currentStep} of 4</span>
        </div>
        <StepIndicator current={currentStep} />
        {STEPS[currentStep]}
      </div>
    </div>
  );
}
