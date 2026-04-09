import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  toastPasswordUpdated,
  toastPasswordResetError,
} from "../../../utils/Toast";
import PasswordField from "../useForm/PasswordField";
import styles from "./ResetPasswordPage.module.css";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onTouched" });

  const newPassword = useWatch({ control, name: "newPassword" });
  const confirmPassword = useWatch({ control, name: "confirmPassword" });

  const onSubmit = async ({ newPassword }) => {
    try {
      const payload = { token, newPassword };
      if (!payload.token) {
        throw new Error("Missing reset token");
      }
      await new Promise((r) => setTimeout(r, 800));
      toastPasswordUpdated();
      setSuccess(true);
    } catch {
      toastPasswordResetError();
    }
  };

  if (!token) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.invalidWrap}>
            <div className={`${styles.iconWrap} ${styles.iconWrapDanger}`}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h1 className={styles.heading}>Invalid reset link</h1>
            <p className={styles.subtext}>
              This password reset link is invalid or has expired. Please request
              a new one.
            </p>
            <Link
              to="/forgot-password"
              className={styles.submitBtn}
              style={{
                textAlign: "center",
                display: "block",
                textDecoration: "none",
              }}
            >
              Request new link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {success ? (
          // ── Success state ───────────────────────────────────────────────
          <div className={styles.successWrap}>
            <div className={`${styles.iconWrap} ${styles.iconWrapSuccess}`}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h1 className={styles.heading}>Password updated</h1>
            <p className={styles.subtext}>
              Your password has been changed successfully. You can now sign in
              with your new password.
            </p>
            <button
              type="button"
              className={styles.submitBtn}
              onClick={() => navigate("/login", { replace: true })}
            >
              Sign in
            </button>
          </div>
        ) : (
          // ── Reset form ──────────────────────────────────────────────────
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
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <h1 className={styles.heading}>Set new password</h1>
              <p className={styles.subtext}>
                Your new password must be at least 8 characters and include an
                uppercase letter, a lowercase letter, and a number.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className={styles.form}
            >
              <PasswordField
                id="newPassword"
                label="New password"
                autoComplete="new-password"
                registration={register("newPassword", {
                  required: "New password is required",
                  minLength: { value: 8, message: "At least 8 characters" },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: "Must include uppercase, lowercase, and a number",
                  },
                })}
                error={errors.newPassword}
              />

              <PasswordField
                id="confirmPassword"
                label="Confirm new password"
                autoComplete="new-password"
                registration={register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === newPassword || "Passwords do not match",
                })}
                error={errors.confirmPassword}
              />

              {/* Password match indicator */}
              {newPassword && confirmPassword && (
                <div
                  className={`${styles.matchBadge} ${confirmPassword === newPassword ? styles.matchOk : styles.matchFail}`}
                >
                  {confirmPassword === newPassword ? (
                    <>
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        width="14"
                        height="14"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Passwords match
                    </>
                  ) : (
                    <>
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        width="14"
                        height="14"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Passwords do not match
                    </>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitBtn}
              >
                {isSubmitting ? "Updating password…" : "Update password"}
              </button>
            </form>

            <p className={styles.footer}>
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
