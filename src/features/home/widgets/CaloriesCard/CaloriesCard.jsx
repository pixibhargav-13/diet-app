import styles from "./CaloriesCard.module.css";

const CONSUMED = 1300;
const GOAL = 2000;

const R = 52;
const CIRC = 2 * Math.PI * R;
const PCT = Math.min((CONSUMED / GOAL) * 100, 100);
const DASH = (PCT / 100) * CIRC;

function getStatus(consumed, goal) {
  const ratio = consumed / goal;
  if (ratio <= 0.85 || (ratio >= 0.95 && ratio <= 1.05)) return "good";
  if (ratio < 0.7 || (ratio > 1.05 && ratio <= 1.2)) return "warn";
  return "danger";
}

const STATUS_COLORS = {
  good: {
    ring: "#2a4365",
    badge: {
      color: "#4a7c59",
      bg: "#f0fdf4",
      border: "#bbf7d0",
      label: "On Track",
    },
  },
  warn: {
    ring: "#d4a72c",
    badge: {
      color: "#92700a",
      bg: "#fff8e1",
      border: "#fde68a",
      label: "Check In",
    },
  },
  danger: {
    ring: "#c44545",
    badge: {
      color: "#c44545",
      bg: "#fdecec",
      border: "#fca5a5",
      label: "Off Track",
    },
  },
};

export default function CaloriesCard() {
  const status = getStatus(CONSUMED, GOAL);
  const { ring, badge } = STATUS_COLORS[status];

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>Calories Consumed</span>
        <span
          className={styles.badge}
          style={{
            color: badge.color,
            background: badge.bg,
            borderColor: badge.border,
          }}
        >
          {badge.label}
        </span>
      </div>

      <div className={styles.donutWrap}>
        <svg viewBox="0 0 120 120" className={styles.donut}>
          <circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="9"
          />
          <circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke={ring}
            strokeWidth="9"
            strokeDasharray={`${DASH} ${CIRC}`}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            style={{ transition: "stroke-dasharray 0.5s ease" }}
          />
        </svg>
        <div className={styles.donutCenter}>
          <span className={styles.donutValue} style={{ color: ring }}>
            {CONSUMED.toLocaleString()}
          </span>
          <span className={styles.donutSub}>
            / {GOAL.toLocaleString()} kcal
          </span>
        </div>
      </div>

      <button type="button" className={styles.logBtn}>
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
