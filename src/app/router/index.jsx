import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../router/ProtectedRoute";
import GuestRoute from "../router/GuestRoute";

import LandingPage from "../../features/landing/pages/LandingPage";
import SignUpPage from "../../features/auth/signup/SignUpPage";
import LoginPage from "../../features/auth/login/LoginPage";
import ForgotPasswordPage from "../../features/auth/forgot-password/ForgotPasswordPage";
import ResetPasswordPage from "../../features/auth/reset-password/ResetPasswordPage";
import OnboardingPage from "../../features/onboarding/OnboardingPage";
import Dashboard from "../../features/dashboard/Dashboard";
import NotFound from "../../features/errors/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },

  {
    path: "/signup",
    element: (
      <GuestRoute>
        <SignUpPage />
      </GuestRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <GuestRoute>
        <ForgotPasswordPage />
      </GuestRoute>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <GuestRoute>
        <ResetPasswordPage />
      </GuestRoute>
    ),
  },

  {
    path: "/onboarding",
    element: (
      <ProtectedRoute requireOnboarding={false}>
        <OnboardingPage />
      </ProtectedRoute>
    ),
  },

  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);
