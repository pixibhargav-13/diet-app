import { createBrowserRouter } from "react-router";
import LandingPage from "../../features/landing/pages/LandingPage";
import NotFound from "../../features/erros/NotFound";
import SignUpPage from "../../features/auth/signup/SignUpPage";
import OnboardingPage from "../../features/onboarding/OnboardingPage";
import Dashboard from "../../features/dashboard/Dashboard";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/signup", element: <SignUpPage /> },
  { path: "/onboarding", element: <OnboardingPage /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "*", element: <NotFound /> },
]);
