import PropTypes from "prop-types";
import styles from "./CaloriesCard.module.css";

const R = 52;
const CIRC = 2 * Math.PI * R;
function getStatus(consumed, goal) {
  if (goal <= 0) return "danger";
  const ratio = consumed / goal;
  const delta = Math.abs(ratio - 1);

  if (delta <= 0.1) return "good";
  if (delta <= 0.25) return "warn";
  return "danger";
}

const STATUS_LABELS = {
  good: "On Track",
  warn: "Check In",
  danger: "Off Track",
};

export default function CaloriesCard({ consumed = 1300, goal = 2000, onQuickLog }) {
  const safeGoal = goal > 0 ? goal : 1;
  const pct = Math.min((consumed / safeGoal) * 100, 100);
  const dash = (pct / 100) * CIRC;
  const status = getStatus(consumed, goal);
  const statusToken = `${status[0].toUpperCase()}${status.slice(1)}`;

  const badgeClassName = `${styles.badge} ${styles[`badge${statusToken}`]}`;
  const ringClassName = `${styles.progressRing} ${styles[`ring${statusToken}`]}`;
  const valueClassName = `${styles.donutValue} ${styles[`value${statusToken}`]}`;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>Calories Consumed</span>
        <span className={badgeClassName}>{STATUS_LABELS[status]}</span>
      </div>

      <div
        className={styles.donutWrap}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={goal > 0 ? goal : 0}
        aria-valuenow={Math.max(0, Math.round(consumed))}
        aria-label="Calories consumed"
      >
        <svg
          viewBox="0 0 120 120"
          className={styles.donut}
          preserveAspectRatio="xMidYMid meet"
        >
          <circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            className={styles.trackRing}
            strokeWidth="9"
          />
          <circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            strokeWidth="9"
            strokeDasharray={`${dash} ${CIRC}`}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            className={ringClassName}
          />
        </svg>
        <div className={styles.donutCenter}>
          <span className={valueClassName}>{consumed.toLocaleString()}</span>
          <span className={styles.donutSub}>/ {Math.max(0, goal).toLocaleString()} kcal</span>
        </div>
      </div>

      <button type="button" className={styles.logBtn} onClick={onQuickLog}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.logIcon}
        >
          <path d="M3 2h18l-2 7H5L3 2z" />
          <path d="M5 9c0 6 14 6 14 0" />
          <path d="M12 13v8" />
          <path d="M8 21h8" />
        </svg>
        Quick-log Meal
      </button>
    </div>
  );
}

CaloriesCard.propTypes = {
  consumed: PropTypes.number,
  goal: PropTypes.number,
  onQuickLog: PropTypes.func,
};
