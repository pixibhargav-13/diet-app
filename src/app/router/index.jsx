import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../router/ProtectedRoute";
import GuestRoute from "../router/GuestRoute";

import LandingPage from "../../features/landing/pages/LandingPage";
import SignUpPage from "../../features/auth/signup/SignUpPage";
import LoginPage from "../../features/auth/login/LoginPage";
import ForgotPasswordPage from "../../features/auth/forgot-password/ForgotPasswordPage";
import ResetPasswordPage from "../../features/auth/reset-password/ResetPasswordPage";
import OnboardingPage from "../../features/onboarding/OnboardingPage";
import DashboardLayout from "../../features/dashboard/DashboardLayout";
import HomePage from "../../features/home/Home";
import JournalPage from "../../features/journal/Journal";
import ProgressPage from "../../features/progress/Progress";
import ConsultPage from "../../features/consult/Consult";
import ShopPage from "../../features/shop/Shop";
import NotFound from "../../features/errors/NotFound";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },

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
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: "journal", element: <JournalPage /> },
      { path: "progress", element: <ProgressPage /> },
      { path: "consult", element: <ConsultPage /> },
      { path: "shop", element: <ShopPage /> },
    ],
  },

  { path: "*", element: <NotFound /> },
]);
