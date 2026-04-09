import { memo, useMemo } from "react";
import PropTypes from "prop-types";
import { useHydrationStore } from "../../../../store/useHydrationStore";
import useHydrationDaySync from "../../../../hooks/useHydrationDaySync";
import styles from "./WaterIntakeCard.module.css";

const GLASS_ML = 250;

const GlassIcon = memo(function GlassIcon({ filled }) {
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
});

GlassIcon.propTypes = {
  filled: PropTypes.bool.isRequired,
};

export default function WaterIntakeCard() {
  useHydrationDaySync();

  const entries = useHydrationStore((state) => state.entriesByDate[state.dateKey] ?? []);
  const goalMl = useHydrationStore((state) => state.goalMl);
  const addEntry = useHydrationStore((state) => state.addEntry);
  const subtractEntry = useHydrationStore((state) => state.subtractEntry);

  const consumedMl = useMemo(
    () => entries.reduce((sum, entry) => sum + entry.ml, 0),
    [entries]
  );

  const targetGlasses = Math.max(1, Math.ceil(goalMl / GLASS_ML));
  const glasses = Math.min(targetGlasses, Math.floor(consumedMl / GLASS_ML));
  const glassSlots = Array.from({ length: targetGlasses }, (_, slot) => slot + 1);

  const consumed = consumedMl / 1000;
  const target = goalMl / 1000;

  const handleAddGlass = () => {
    addEntry(GLASS_ML, "Water Bottle");
  };

  const handleRemoveGlass = () => {
    subtractEntry(GLASS_ML, "Water Bottle");
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
        {glassSlots.map((slot) => (
          <GlassIcon key={slot} filled={slot <= glasses} />
        ))}
      </div>

      <div className={styles.actionRow}>
        <button
          type="button"
          onClick={handleAddGlass}
          className={styles.addBtn}
          disabled={consumedMl >= goalMl}
        >
          + Add 250ml Glass
        </button>
        <button
          type="button"
          onClick={handleRemoveGlass}
          className={styles.removeBtn}
          disabled={consumedMl <= 0}
        >
          - Remove 250ml Glass
        </button>
      </div>
    </div>
  );
}
