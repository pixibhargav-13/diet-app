// Step 4 — optional blood report / prescription upload + finish
import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { useOnboardingStore } from "../../../store/useOnboardingStore";
import StepLayout from "../components/StepLayout";
import styles from "./DocumentStep.module.css";

const ACCEPTED = ".pdf,.jpg,.jpeg,.png";
const MAX_MB = 10;

export default function DocumentStep({ onBack, onFinish }) {
  const { documents, addDocument, removeDocument, completeOnboarding } =
    useOnboardingStore();
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = (files) => {
    setError("");
    Array.from(files).forEach((file) => {
      if (file.size > MAX_MB * 1024 * 1024) {
        setError(`"${file.name}" exceeds ${MAX_MB}MB limit.`);
        return;
      }
      addDocument({
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
      });
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const fmt = (bytes) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(0)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  const handleFinish = () => {
    completeOnboarding();
    onFinish();
  };

  return (
    <StepLayout
      heading="Upload health documents"
      subtext="Optionally upload blood reports or prescriptions. Your dietitian will review them before your first consultation."
      onBack={onBack}
      onNext={handleFinish}
      nextLabel="Complete setup"
      isLast
    >
      {/* Optional badge */}
      <span className={styles.optionalBadge}>
        Optional — you can add these later from your profile
      </span>

      {/* Drop zone */}
      <button
        type="button"
        className={`${styles.dropZone} ${dragOver ? styles.dropZoneActive : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        aria-label="Upload documents"
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          multiple
          className={styles.hiddenInput}
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className={styles.dropIcon}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <p className={styles.dropMain}>Click to upload or drag & drop</p>
        <p className={styles.dropSub}>
          PDF, JPG, PNG — max {MAX_MB}MB per file
        </p>
      </button>

      {/* Error */}
      {error && <p className={styles.errorMsg}>{error}</p>}

      {/* File list */}
      {documents.length > 0 && (
        <ul className={styles.fileList}>
          {documents.map((doc) => (
            <li key={doc.name} className={styles.fileItem}>
              <div className={styles.fileIcon}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="18"
                  height="18"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div className={styles.fileMeta}>
                <span className={styles.fileName}>{doc.name}</span>
                <span className={styles.fileSize}>{fmt(doc.size)}</span>
              </div>
              <button
                type="button"
                onClick={() => removeDocument(doc.name)}
                className={styles.removeBtn}
                aria-label={`Remove ${doc.name}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="16"
                  height="16"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </StepLayout>
  );
}

DocumentStep.propTypes = {
  onBack: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
};
