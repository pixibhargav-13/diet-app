import styles from "./HealthTipCard.module.css";

const FOCUS = [
  {
    color: "#4a7c59",
    text: "Target 8,000 steps to maintain cardiovascular health.",
  },
  {
    color: "#d4a72c",
    text: "Prioritize high-fiber proteins for lunch to avoid the afternoon energy slump.",
  },
];

export default function HealthTipCard() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconWrap}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="2" x2="12" y2="6" />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
            <line x1="2" y1="12" x2="6" y2="12" />
            <line x1="18" y1="12" x2="22" y2="12" />
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
          </svg>
        </div>
        <span className={styles.title}>Daily Health Insight</span>
      </div>

      <div className={styles.tipBox}>
        <p className={styles.tipTitle}>Morning Habit</p>
        <p className={styles.tipText}>
          Drinking 500ml of water right after waking up helps jumpstart your
          metabolism and improves cognitive function for the day.
        </p>
      </div>

      <p className={styles.focusLabel}>Today&apos;s Focus</p>
      <ul className={styles.focusList}>
        {FOCUS.map((f) => (
          <li key={f.text} className={styles.focusItem}>
            <span className={styles.focusDot} style={{ background: f.color }} />
            <span className={styles.focusText}>{f.text}</span>
          </li>
        ))}
      </ul>

      <button type="button" className={styles.exploreBtn}>
        Explore More Tips
      </button>
    </div>
  );
}
