import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useOnboardingStore } from "../../../store/useOnboardingStore";
import StepLayout from "../components/StepLayout";
import styles from "./BmiStep.module.css";

const BMI_RANGES = [
  { max: 18.4, category: "Underweight", color: "#5a8fa3", bg: "#eef4fa" },
  { max: 24.9, category: "Normal", color: "#4a7c59", bg: "#f0fdf4" },
  { max: 29.9, category: "Overweight", color: "#d4a72c", bg: "#fff8e1" },
  { max: Infinity, category: "Obese", color: "#c44545", bg: "#fdecec" },
];

function calcBmi(weightKg, heightCm) {
  const h = Number.parseFloat(heightCm) / 100;
  const w = Number.parseFloat(weightKg);
  if (!h || !w || h <= 0) return null;
  return +(w / (h * h)).toFixed(1);
}

function getCategory(bmi) {
  return BMI_RANGES.find((r) => bmi <= r.max);
}

export default function BmiStep({ onNext, onBack }) {
  const { bmi: saved, setBmi, setStep } = useOnboardingStore();
  const [age, setAge] = useState(saved.age);
  const [gender, setGender] = useState(saved.gender);
  const [height, setHeight] = useState(saved.heightCm);
  const [weight, setWeight] = useState(saved.weightKg);
  const result = useMemo(() => {
    if (!height || !weight) return null;
    return calcBmi(weight, height);
  }, [height, weight]);

  const category = useMemo(
    () => (result ? getCategory(result) : null),
    [result],
  );

  const canProceed = age && gender && height && weight;

  const handleNext = () => {
    setBmi({
      age,
      gender,
      heightCm: height,
      weightKg: weight,
      result,
      category: category?.category ?? "",
    });
    setStep(4);
    onNext();
  };

  return (
    <StepLayout
      heading="Calculate your BMI"
      subtext="We use this to set accurate calorie targets and track your progress over time."
      onBack={onBack}
      onNext={handleNext}
      nextDisabled={!canProceed}
    >
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="bmi-age" className={styles.label}>
            Age
          </label>
          <input
            id="bmi-age"
            type="number"
            min="10"
            max="100"
            placeholder="e.g. 28"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <p className={styles.label}>Gender</p>
          <div className={styles.genderRow}>
            {["male", "female", "other"].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={`${styles.genderChip} ${gender === g ? styles.genderChipSelected : ""}`}
                aria-pressed={gender === g}
              >
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="bmi-height" className={styles.label}>
            Height (cm)
          </label>
          <input
            id="bmi-height"
            type="number"
            min="50"
            max="250"
            placeholder="e.g. 168"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="bmi-weight" className={styles.label}>
            Weight (kg)
          </label>
          <input
            id="bmi-weight"
            type="number"
            min="20"
            max="300"
            placeholder="e.g. 72"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className={styles.input}
          />
        </div>
      </div>

      {Boolean(result && category) && (
        <div
          className={styles.resultCard}
          style={{ borderColor: category.color, background: category.bg }}
        >
          <div className={styles.resultLeft}>
            <p className={styles.resultLabel}>Your BMI</p>
            <p className={styles.resultValue} style={{ color: category.color }}>
              {result}
            </p>
          </div>
          <div className={styles.resultRight}>
            <span
              className={styles.resultCategory}
              style={{ color: category.color }}
            >
              {category.category}
            </span>
            <p className={styles.resultHint}>
              {category.category === "Normal"
                ? "Great — your BMI is in the healthy range."
                : "Your diet plan will be tailored to improve this."}
            </p>
          </div>
        </div>
      )}

      <div className={styles.scaleWrap}>
        <div className={styles.scaleBar}>
          <div
            className={styles.scaleSegment}
            style={{ background: "#5a8fa3" }}
          />
          <div
            className={styles.scaleSegment}
            style={{ background: "#4a7c59" }}
          />
          <div
            className={styles.scaleSegment}
            style={{ background: "#d4a72c" }}
          />
          <div
            className={styles.scaleSegment}
            style={{ background: "#c44545" }}
          />
        </div>
        <div className={styles.scaleLabels}>
          <span>&lt;18.5</span>
          <span>18.5–24.9</span>
          <span>25–29.9</span>
          <span>&gt;30</span>
        </div>
      </div>
    </StepLayout>
  );
}

BmiStep.propTypes = {
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};
