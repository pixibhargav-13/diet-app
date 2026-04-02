import { useState } from "react";
import PropTypes from "prop-types";
import { Droplets, Settings, Circle, Leaf, CheckCircle } from "lucide-react";
import { useOnboardingStore } from "../../../store/useOnboardingStore";
import StepLayout from "../components/StepLayout";
import styles from "./HealthProfileStep.module.css";

const CONDITIONS = [
  { id: "diabetes", label: "Diabetes", Icon: Droplets },
  { id: "thyroid", label: "Thyroid", Icon: Settings },
  { id: "pcod", label: "PCOD/PCOS", Icon: Circle },
  { id: "allergies", label: "Allergies", Icon: Leaf },
  { id: "none", label: "None of the above", Icon: CheckCircle },
];

const DIETARY = [
  { id: "veg", label: "Vegetarian" },
  { id: "non-veg", label: "Non-Vegetarian" },
  { id: "vegan", label: "Vegan" },
];

export default function HealthProfileStep({ onNext }) {
  const { healthProfile, setHealthProfile, setStep } = useOnboardingStore();
  const [conditions, setConditions] = useState(healthProfile.conditions);
  const [allergies, setAllergies] = useState(healthProfile.allergies);
  const [diet, setDiet] = useState(healthProfile.dietaryPreference);

  const toggleCondition = (id) => {
    if (id === "none") {
      setConditions(["none"]);
      return;
    }
    setConditions((prev) => {
      const without = prev.filter((c) => c !== "none");
      return without.includes(id)
        ? without.filter((c) => c !== id)
        : [...without, id];
    });
  };

  const canProceed = diet !== "";

  const handleNext = () => {
    setHealthProfile({ conditions, allergies, dietaryPreference: diet });
    setStep(2);
    onNext();
  };

  return (
    <StepLayout
      heading="Tell us about your health"
      subtext="This helps us personalise your diet plan. Select everything that applies."
      onNext={handleNext}
      nextDisabled={!canProceed}
    >
      <p className={styles.sectionLabel}>
        Do you have any of these conditions?
      </p>
      <div className={styles.conditionGrid}>
        {CONDITIONS.map((c) => {
          const selected = conditions.includes(c.id);
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => toggleCondition(c.id)}
              className={`${styles.conditionCard} ${selected ? styles.conditionSelected : ""}`}
              aria-pressed={selected}
            >
              <span className={styles.conditionIcon}>
                <c.Icon size={24} />
              </span>
              <span className={styles.conditionLabel}>{c.label}</span>
              <span
                className={`${styles.tick} ${selected ? styles.tickVisible : ""}`}
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  width="12"
                  height="12"
                >
                  <path
                    fillRule="evenodd"
                    d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </button>
          );
        })}
      </div>

      {conditions.includes("allergies") && (
        <div className={styles.allergyField}>
          <label htmlFor="allergy-detail" className={styles.fieldLabel}>
            Please describe your allergies
          </label>
          <input
            id="allergy-detail"
            type="text"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            placeholder="e.g. nuts, dairy, gluten"
            className={styles.textInput}
          />
        </div>
      )}

      <p className={styles.sectionLabel} style={{ marginTop: 28 }}>
        Dietary preference <span className={styles.required}>*</span>
      </p>
      <div className={styles.dietRow}>
        {DIETARY.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setDiet(d.id)}
            className={`${styles.dietChip} ${diet === d.id ? styles.dietChipSelected : ""}`}
            aria-pressed={diet === d.id}
          >
            {d.label}
          </button>
        ))}
      </div>
    </StepLayout>
  );
}

HealthProfileStep.propTypes = { onNext: PropTypes.func.isRequired };
