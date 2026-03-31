// Forgot password — email input, shows confirmation state after submit
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import {
  toastPasswordResetSent,
  toastPasswordResetError,
} from "../../../utils/Toast";
import FormField from "../useForm/FormField";
import styles from "./ForgotPasswordPage.module.css";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onTouched" });

  const onSubmit = async ({ email }) => {
    try {
      await new Promise((r) => setTimeout(r, 800));
      setSentEmail(email);
      setSubmitted(true);
      toastPasswordResetSent();
    } catch {
      toastPasswordResetError();
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Link
          to="/login"
          className={styles.backLink}
          aria-label="Back to login"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.backIcon}
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </Link>

        {submitted ? (
          <div className={styles.confirmation}>
            <div className={styles.confirmIcon}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>

            <h1 className={styles.confirmHeading}>Check your inbox</h1>
            <p className={styles.confirmText}>
              We sent a password reset link to{" "}
              <strong className={styles.confirmEmail}>{sentEmail}</strong>. It
              may take a few minutes to arrive.
            </p>

            <p className={styles.confirmHint}>
              Didn't get it? Check your spam folder or{" "}
              <button
                type="button"
                className={styles.resendBtn}
                onClick={() => setSubmitted(false)}
              >
                try a different email.
              </button>
            </p>

            <Link to="/login" className={styles.backToLogin}>
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
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
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h1 className={styles.heading}>Forgot your password?</h1>
              <p className={styles.subtext}>
                Enter the email address linked to your account and we'll send
                you a reset link.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className={styles.form}
            >
              <FormField
                id="email"
                label="Email address"
                type="email"
                placeholder="jane@example.com"
                required
                autoComplete="email"
                registration={register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
                error={errors.email}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitBtn}
              >
                {isSubmitting ? "Sending…" : "Send reset link"}
              </button>
            </form>

            <p className={styles.footer}>
              Remembered it?{" "}
              <Link to="/login" className={styles.footerLink}>
                Back to sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
