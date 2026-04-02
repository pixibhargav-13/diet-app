import { Link } from "react-router-dom";
import styles from "./DietPlanCard.module.css";
import mealImg from "../../../../assets/home/home-1.webp";

export default function DietPlanCard() {
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
            <span className={styles.tagBlue}>Next up: Lunch</span>
            <span className={styles.tagGray}>Scheduled for 1:30 PM</span>
          </div>
          <h3 className={styles.mealName}>Grilled Chicken Salad</h3>
          <div className={styles.meta}>
            <span className={styles.metaItem}>
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className={styles.metaIcon}
              >
                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
              </svg>
              450 kcal
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
              15 mins prep
            </span>
          </div>
        </div>

        <Link
          to="/dashboard/journal"
          className={styles.arrowBtn}
          aria-label="View meal"
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
        </Link>
      </div>
    </div>
  );
}
