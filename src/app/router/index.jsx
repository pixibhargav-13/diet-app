import { createBrowserRouter } from "react-router";
import ProtectedRoute from "../router/ProtectedRoute";
import GuestRoute from "../router/GuestRoute";

import LandingPage from "../../features/landing/pages/LandingPage";
import SignUpPage from "../../features/auth/signup/SignUpPage";
import LoginPage from "../../features/auth/login/LoginPage";
import OnboardingPage from "../../features/onboarding/OnboardingPage";
import DashboardLayout from "../../features/dashboard/DashboardLayout";
// import HomePage from "../../features/home/Home";
// import JournalPage from "../../features/journal/Journal";
// import ProgressPage from "../../features/progress/Progress";
import NotFound from "../../features/errors/NotFound";
// import ConsultPage from "../../features/consultations/Consult";
// import ShopPage from "../../features/shop/Shop";

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
    // children: [
    //   { index: true, element: <HomePage /> },
    //   { path: "journal", element: <JournalPage /> },
    //   { path: "progress", element: <ProgressPage /> },
    //   { path: "consult", element: <ConsultPage /> },
    //   { path: "shop", element: <ShopPage /> },
    // ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);
