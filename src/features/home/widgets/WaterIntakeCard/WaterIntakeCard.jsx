import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./WaterIntakeCard.module.css";

const TOTAL_GLASSES = 6;
const GLASS_ML = 250;
const TARGET_GLASSES = 12;

function GlassIcon({ filled }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${styles.glass} ${filled ? styles.glassFilled : styles.glassEmpty}`}
    >
      <path
        d="M5 2h14l-1.5 18H6.5L5 2z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
        fill={filled ? "currentColor" : "none"}
        fillOpacity={filled ? 0.15 : 0}
      />
    </svg>
  );
}

GlassIcon.propTypes = {
  filled: PropTypes.bool.isRequired,
};

export default function WaterIntakeCard() {
  const [glasses, setGlasses] = useState(TOTAL_GLASSES);

  const consumed = (glasses * GLASS_ML) / 1000;
  const target = (TARGET_GLASSES * GLASS_ML) / 1000;

  const add = () => {
    if (glasses < TARGET_GLASSES) setGlasses((g) => g + 1);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>Water Intake</span>
        <span className={styles.amount}>
          {consumed.toFixed(1)}L / {target}L
        </span>
      </div>

      <div className={styles.glassGrid}>
        {Array.from({ length: TARGET_GLASSES }, (_, slot) => slot + 1).map(
          (slot) => (
            <GlassIcon key={slot} filled={slot <= glasses} />
          ),
        )}
      </div>

      <button
        type="button"
        onClick={add}
        className={styles.addBtn}
        disabled={glasses >= TARGET_GLASSES}
      >
        + Add 250ml Glass
      </button>
    </div>
  );
}
