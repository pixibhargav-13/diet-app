import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import { toastLoginSuccess, toastLoginError } from "../../../utils/Toast";
import FormField from "../useForm/FormField";
import PasswordField from "../useForm/PasswordField";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    clearErrors("root");

    try {
      const result = await login(data);

      if (!result?.success) {
        const message = result?.message || "Incorrect email or password.";
        setError("root", { type: "server", message });
        toastLoginError();
        return;
      }

      toastLoginSuccess(result.user?.firstName);
    } catch {
      setError("root", {
        type: "server",
        message: "Unable to sign in right now. Please try again.",
      });
      toastLoginError();
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Link to="/" className={styles.logoLink} aria-label="Back to home">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.backIcon}>
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </Link>
          <h1 className={styles.heading}>Welcome back</h1>
          <p className={styles.subtext}>Sign in to continue your health journey.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className={styles.form}>
          {errors.root?.message ? (
            <p role="alert">{errors.root.message}</p>
          ) : null}

          <FormField
            id="email"
            label="Email address"
            type="email"
            placeholder="jane@example.com"
            required
            autoComplete="email"
            registration={register('email', {
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
            })}
            error={errors.email}
          />

          <div className={styles.passwordBlock}>
            <PasswordField
              id="password"
              label="Password"
              autoComplete="current-password"
              registration={register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'At least 8 characters' },
              })}
              error={errors.password}
            />
            <div className={styles.forgotRow}>
              <Link to="/forgot-password" className={styles.forgotLink}>Forgot password?</Link>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className={styles.footer}>
          Don&apos;t have an account?{' '}
          <Link to="/signup" className={styles.footerLink}>Create one</Link>
        </p>
      </div>
    </div>
  )
}