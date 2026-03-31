import toast from "react-hot-toast";

// ─── Base style tokens (matches your design system) ──────────────────────────

const base = {
  borderRadius: "12px",
  padding: "14px 18px",
  fontSize: "0.9375rem",
  fontWeight: "500",
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.10)",
  maxWidth: "360px",
};

// ─── Theme variants ───────────────────────────────────────────────────────────

const themes = {
  success: {
    style: {
      ...base,
      border: "1px solid #4a6fa5",
      color: "#2a4365",
      background: "#eef4fa",
    },
    iconTheme: { primary: "#2a4365", secondary: "#eef4fa" },
  },
  error: {
    style: {
      ...base,
      border: "1px solid #c44545",
      color: "#c44545",
      background: "#fdecec",
    },
    iconTheme: { primary: "#c44545", secondary: "#fdecec" },
  },
  warning: {
    style: {
      ...base,
      border: "1px solid #d4a72c",
      color: "#92700a",
      background: "#fff8e1",
    },
    iconTheme: { primary: "#d4a72c", secondary: "#fff8e1" },
  },
  info: {
    style: {
      ...base,
      border: "1px solid #7faad6",
      color: "#2a4365",
      background: "#eef4fa",
    },
    iconTheme: { primary: "#7faad6", secondary: "#eef4fa" },
  },
};

// ─── Generic toasts ───────────────────────────────────────────────────────────

export const toastSuccess = (msg) => toast.success(msg, themes.success);
export const toastError = (msg) => toast.error(msg, themes.error);
export const toastWarning = (msg) =>
  toast(msg, { ...themes.warning, icon: "⚠️" });
export const toastInfo = (msg) => toast(msg, { ...themes.info, icon: "ℹ️" });

// ─── Auth — Sign Up ───────────────────────────────────────────────────────────

export const toastSignUpSuccess = () =>
  toast.success("Account created! Welcome aboard 🎉", themes.success);

export const toastSignUpError = () =>
  toast.error("Could not create account. Please try again.", themes.error);

export const toastEmailTaken = () =>
  toast.error(
    "This email is already registered. Try logging in.",
    themes.error,
  );

// ─── Auth — Login ─────────────────────────────────────────────────────────────

export const toastLoginSuccess = (name) => {
  const suffix = name ? ", " + name : "";
  return toast.success(`Welcome back${suffix}!`, themes.success);
};

export const toastLoginError = () =>
  toast.error("Incorrect email or password.", themes.error);

export const toastSessionExpired = () =>
  toast("Your session expired. Please sign in again.", {
    ...themes.warning,
    icon: "⚠️",
  });

// ─── Auth — Password ──────────────────────────────────────────────────────────

export const toastPasswordResetSent = () =>
  toast.success("Password reset link sent — check your inbox.", themes.success);

export const toastPasswordResetError = () =>
  toast.error("Could not send reset link. Try again.", themes.error);

export const toastPasswordUpdated = () =>
  toast.success("Password updated successfully.", themes.success);

// ─── Profile / Onboarding ────────────────────────────────────────────────────

export const toastProfileSaved = () =>
  toast.success("Profile saved.", themes.success);

export const toastProfileError = () =>
  toast.error("Could not save profile. Please try again.", themes.error);

export const toastGoalUpdated = () =>
  toast.success("Health goal updated.", themes.success);

// ─── Diet Journal ─────────────────────────────────────────────────────────────

export const toastMealLogged = () =>
  toast.success("Meal logged successfully.", themes.success);

export const toastMealLogError = () =>
  toast.error("Could not log meal. Please try again.", themes.error);

export const toastWaterLogged = () =>
  toast.success("Water intake updated.", themes.success);

export const toastReminderSet = () =>
  toast("Meal reminder set.", { ...themes.info, icon: "🔔" });

// ─── Consultations ────────────────────────────────────────────────────────────

export const toastAppointmentBooked = () =>
  toast.success("Appointment booked! Check your schedule.", themes.success);

export const toastAppointmentCancelled = () =>
  toast("Appointment cancelled.", { ...themes.warning, icon: "⚠️" });

export const toastAppointmentError = () =>
  toast.error("Could not book appointment. Please try again.", themes.error);

// ─── Shop / Orders ────────────────────────────────────────────────────────────

export const toastAddedToCart = (name) =>
  toast.success(`${name ?? "Item"} added to cart.`, themes.success);

export const toastOrderPlaced = () =>
  toast.success(
    "Order placed! You will receive a confirmation shortly.",
    themes.success,
  );

export const toastOrderError = () =>
  toast.error("Could not place order. Please try again.", themes.error);

export const toastPromoApplied = (code) =>
  toast.success(`Promo code "${code}" applied.`, themes.success);

export const toastPromoInvalid = () =>
  toast.error("Invalid or expired promo code.", themes.error);

// ─── Generic network / async ──────────────────────────────────────────────────

export const toastSaved = () => toast.success("Changes saved.", themes.success);

export const toastNetworkError = () =>
  toast.error(
    "Network error. Check your connection and try again.",
    themes.error,
  );

export const toastCopied = () =>
  toast("Copied to clipboard.", { ...themes.info, icon: "📋" });

// ─── Promise toast — wraps any async call ────────────────────────────────────
// Usage: toastPromise(apiCall(), { loading: '...', success: '...', error: '...' })

export const toastPromise = (promise, { loading, success, error }) =>
  toast.promise(
    promise,
    { loading, success, error },
    {
      success: themes.success,
      error: themes.error,
      loading: {
        style: {
          ...base,
          border: "1px solid #e5e7eb",
          color: "#6b7280",
          background: "#ffffff",
        },
      },
    },
  );
