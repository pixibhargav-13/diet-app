import PropTypes from "prop-types";
import styles from "./StepIndicator.module.css";

const STEPS = [
  { id: 1, label: "Health Profile" },
  { id: 2, label: "Your Goal" },
  { id: 3, label: "BMI Check" },
  { id: 4, label: "Documents" },
];

export default function StepIndicator({ current }) {
  const progress = ((current - 1) / (STEPS.length - 1)) * 100;
  const labelClassByStatus = {
    complete: styles.label_complete,
    current: styles.label_current,
    upcoming: styles.label_upcoming,
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.barTrack}>
        <div className={styles.barFill} style={{ width: `${progress}%` }} />
      </div>

      <ol className={styles.steps} aria-label="Onboarding progress">
        {STEPS.map((s) => {
          let status = "upcoming";
          if (s.id < current) {
            status = "complete";
          } else if (s.id === current) {
            status = "current";
          }

          return (
            <li key={s.id} className={styles.step}>
              <span className={`${styles.stepNum} ${styles[status]}`}>
                {status === "complete" ? (
                  <svg
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    width="14"
                    height="14"
                  >
                    <path
                      fillRule="evenodd"
                      d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  s.id
                )}
              </span>
              <span
                className={`${styles.stepLabel} ${labelClassByStatus[status]}`}
              >
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

StepIndicator.propTypes = {
  current: PropTypes.number.isRequired,
};
