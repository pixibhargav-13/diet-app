import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import {
  toastSignUpSuccess,
  toastEmailTaken,
  toastSignUpError,
} from "../../../utils/Toast";
import FormField from "../useForm/FormField";
import PasswordField from "../useForm/PasswordField";
import styles from "./SignUpPage.module.css";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signUp, isLoading, isAuthenticated, clearError } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) navigate("/onboarding", { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  const onSubmit = async (data) => {
    const result = await signUp(data);

    if (result.success) {
      toastSignUpSuccess();
      navigate("/onboarding", { replace: true });
      return;
    }

    if (result.message?.toLowerCase().includes("email")) {
      toastEmailTaken();
    } else {
      toastSignUpError();
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Link to="/" className={styles.logoLink} aria-label="Back to home">
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
          <h1 className={styles.heading}>Create your account</h1>
          <p className={styles.subtext}>
            Start your health journey today. No credit card required.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className={styles.form}
        >
          <div className={styles.nameRow}>
            <FormField
              id="firstName"
              label="First name"
              placeholder="Jane"
              required
              autoComplete="given-name"
              registration={register("firstName", {
                required: "First name is required",
                minLength: { value: 2, message: "At least 2 characters" },
              })}
              error={errors.firstName}
            />
            <FormField
              id="lastName"
              label="Last name"
              placeholder="Doe"
              required
              autoComplete="family-name"
              registration={register("lastName", {
                required: "Last name is required",
                minLength: { value: 2, message: "At least 2 characters" },
              })}
              error={errors.lastName}
            />
          </div>

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

          <PasswordField
            id="password"
            label="Password"
            registration={register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "At least 8 characters" },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: "Must include uppercase, lowercase, and a number",
              },
            })}
            error={errors.password}
          />

          <div className={styles.checkRow}>
            <input
              id="terms"
              type="checkbox"
              className={styles.checkbox}
              {...register("terms", { required: "You must accept the terms" })}
            />
            <label htmlFor="terms" className={styles.checkLabel}>
              I agree to the{" "}
              <a href="/terms" className={styles.inlineLink}>
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className={styles.inlineLink}>
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.terms && (
            <p className={styles.termsError} role="alert">
              {errors.terms.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitBtn}
          >
            {isLoading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account?
          <Link to="/login" className={styles.footerLink}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
