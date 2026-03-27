import PropTypes from "prop-types";
import styles from "./StepLayout.module.css";

export default function StepLayout({
  heading,
  subtext,
  children,
  onBack,
  onNext,
  nextLabel = "Next",
  nextDisabled = false,
  isLast = false,
}) {
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h1 className={styles.heading}>{heading}</h1>
        {subtext && <p className={styles.subtext}>{subtext}</p>}
      </div>

      <div className={styles.content}>{children}</div>

      <div className={styles.nav}>
        {onBack && (
          <button type="button" onClick={onBack} className={styles.backBtn}>
            ← Back
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className={`${styles.nextBtn} ${isLast ? styles.nextBtnFinish : ""}`}
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}

StepLayout.propTypes = {
  heading: PropTypes.string.isRequired,
  subtext: PropTypes.string,
  children: PropTypes.node.isRequired,
  onBack: PropTypes.func,
  onNext: PropTypes.func.isRequired,
  nextLabel: PropTypes.string,
  nextDisabled: PropTypes.bool,
  isLast: PropTypes.bool,
};
