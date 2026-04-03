import styles from "./WeightCard.module.css";

export default function WeightCard() {
  return (
    <div className={styles.card}>
      <div className={styles.stat}>
        <span className={styles.label}>Current Weight</span>
        <div className={styles.valueRow}>
          <span className={styles.value}>78.4</span>
          <span className={styles.unit}>kg</span>
        </div>
        <span className={styles.delta}>
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className={styles.deltaIcon}
          >
            <path
              fillRule="evenodd"
              d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04L10.75 5.612V16.25A.75.75 0 0 1 10 17Z"
              clipRule="evenodd"
            />
          </svg>
          0.5kg this week
        </span>
      </div>

      <div className={styles.divider} />

      <div className={styles.stat}>
        <span className={styles.label}>Last Logged</span>
        <div className={styles.valueRow}>
          <span className={styles.value}>78.9</span>
          <span className={styles.unit}>kg</span>
        </div>
        <span className={styles.muted}>Logged 3 days ago</span>
      </div>
    </div>
  );
}
