import { useAuthStore } from "../../store/useAuthStore";
import CaloriesCard from "./widgets/CaloriesCard/CaloriesCard";
import WaterIntakeCard from "./widgets/WaterIntakeCard/WaterIntakeCard";
import AppointmentCard from "./widgets/AppointmentCard/AppointmentCard";
import DietPlanCard from "./widgets/DietPlanCard/DietPlanCard";
import WeightCard from "./widgets/WeightCard/WeightCard";
import HealthTipCard from "./widgets/HealthTipCard/HealthTipCard";
import RecommendedProducts from "./widgets/RecommendedProducts/RecommendedProducts";
import styles from "./Home.module.css";

export default function HomePage() {
  const { user } = useAuthStore();
  const hour = new Date().getHours();
  let greeting = "Good evening";
  if (hour < 12) {
    greeting = "Good morning";
  } else if (hour < 17) {
    greeting = "Good afternoon";
  }

  return (
    <div className={styles.page}>
      <div className={styles.greetingRow}>
        <div className={styles.avatar}>
          {user?.firstName?.[0]?.toUpperCase() ?? "U"}
        </div>
        <div>
          <p className={styles.greetingName}>
            {greeting}, {user?.firstName ?? "there"}!
          </p>
          <p className={styles.greetingDate}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
            {" · "}You&apos;re doing great!
          </p>
        </div>
      </div>

      <div className={styles.topGrid}>
        <CaloriesCard />
        <WaterIntakeCard />
        <AppointmentCard />
      </div>

      <div className={styles.midGrid}>
        <div className={styles.midLeft}>
          <DietPlanCard />
          <RecommendedProducts />
        </div>

        <div className={styles.midRight}>
          <WeightCard />
          <HealthTipCard />
        </div>
      </div>
    </div>
  );
}
