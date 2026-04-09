import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useNutritionStore } from "../../../../store/useNutritionStore";
import { toastInfo, toastMealLogged, toastWarning } from "../../../../utils/Toast";
import styles from "./DietPlanCard.module.css";
import mealImg from "../../../../assets/home/home-1.webp";

export default function DietPlanCard() {
  const [nowTick, setNowTick] = useState(() => Date.now());
  const quickLogNextMeal = useNutritionStore((state) => state.quickLogNextMeal);
  const nextMeal = useNutritionStore((state) =>
    state.getNextPlannedMealForDate(undefined, new Date(nowTick))
  );

  useEffect(() => {
    const timerId = setInterval(() => setNowTick(Date.now()), 60_000);
    return () => clearInterval(timerId);
  }, []);

  const mealDisplay = useMemo(() => {
    if (nextMeal) {
      return {
        label: `Next up: ${nextMeal.type}`,
        time: `Scheduled for ${nextMeal.time}`,
        name: nextMeal.name,
        kcal: `${nextMeal.kcal} kcal`,
      };
    }

    return {
      label: "Next up: All Logged",
      time: "Today's plan is complete",
      name: "Great work. You have logged every planned meal.",
      kcal: "0 kcal",
    };
  }, [nextMeal]);

  const handleQuickLog = () => {
    const result = quickLogNextMeal("Home Diet Plan Card");

    if (result.ok) {
      toastMealLogged();
      return;
    }

    if (result.reason === "NO_PENDING_MEALS") {
      toastInfo("All planned meals for today are already logged.");
      return;
    }

    toastWarning("Unable to quick-log right now.");
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>Today&apos;s Diet Plan</span>
        <Link to="/dashboard/journal" className={styles.viewAll}>
          View Full Menu
        </Link>
      </div>

      <div className={styles.mealRow}>
        <img
          src={mealImg}
          alt="Grilled Chicken Salad"
          className={styles.mealImg}
        />

        <div className={styles.mealInfo}>
          <div className={styles.tags}>
            <span className={styles.tagBlue}>{mealDisplay.label}</span>
            <span className={styles.tagGray}>{mealDisplay.time}</span>
          </div>
          <h3 className={styles.mealName}>{mealDisplay.name}</h3>
          <div className={styles.meta}>
            <span className={styles.metaItem}>
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className={styles.metaIcon}
              >
                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
              </svg>
              {mealDisplay.kcal}
            </span>
            <span className={styles.metaItem}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.metaIconStroke}
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {nextMeal ? `${nextMeal.time}` : "Plan completed"}
            </span>
          </div>
        </div>

        <button
          type="button"
          className={styles.arrowBtn}
          onClick={handleQuickLog}
          aria-label="Quick log next meal"
          disabled={!nextMeal}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
