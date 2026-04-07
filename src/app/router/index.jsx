import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../router/ProtectedRoute";
import GuestRoute from "../router/GuestRoute";

const LandingPage = lazy(() => import("../../features/landing/pages/LandingPage"));
const SignUpPage = lazy(() => import("../../features/auth/signup/SignUpPage"));
const LoginPage = lazy(() => import("../../features/auth/login/LoginPage"));
const ForgotPasswordPage = lazy(() =>
  import("../../features/auth/forgot-password/ForgotPasswordPage")
);
const ResetPasswordPage = lazy(() =>
  import("../../features/auth/reset-password/ResetPasswordPage")
);
const OnboardingPage = lazy(() => import("../../features/onboarding/OnboardingPage"));
const DashboardLayout = lazy(() => import("../../features/dashboard/DashboardLayout"));
const HomePage = lazy(() => import("../../features/home/Home"));
const JournalPage = lazy(() => import("../../features/journal/Journal"));
const ProgressPage = lazy(() => import("../../features/progress/ProgressPage"));
const ConsultPage = lazy(() => import("../../features/consult/Consult"));
const ShopPage = lazy(() => import("../../features/shop/Shop"));
const NotFound = lazy(() => import("../../features/errors/NotFound"));

function withSuspense(element) {
  return <Suspense fallback={null}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  { path: "/", element: withSuspense(<LandingPage />) },

  {
    path: "/signup",
    element: (
      <GuestRoute>
        {withSuspense(<SignUpPage />)}
      </GuestRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <GuestRoute>
        {withSuspense(<LoginPage />)}
      </GuestRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <GuestRoute>
        {withSuspense(<ForgotPasswordPage />)}
      </GuestRoute>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <GuestRoute>
        {withSuspense(<ResetPasswordPage />)}
      </GuestRoute>
    ),
  },

  {
    path: "/onboarding",
    element: (
      <ProtectedRoute requireOnboarding={false}>
        {withSuspense(<OnboardingPage />)}
      </ProtectedRoute>
    ),
  },

  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        {withSuspense(<DashboardLayout />)}
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: withSuspense(<HomePage />) },
      { path: "journal", element: withSuspense(<JournalPage />) },
      { path: "progress", element: withSuspense(<ProgressPage />) },
      { path: "consult", element: withSuspense(<ConsultPage />) },
      { path: "shop", element: withSuspense(<ShopPage />) },
    ],
  },

  { path: "*", element: withSuspense(<NotFound />) },
]);
