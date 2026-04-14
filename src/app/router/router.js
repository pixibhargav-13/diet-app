import { Suspense, createElement, lazy } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

const LandingPage = lazy(
  () => import("../../features/landing/pages/LandingPage"),
);
const SignUpPage = lazy(() => import("../../features/auth/signup/SignUpPage"));
const LoginPage = lazy(() => import("../../features/auth/login/LoginPage"));
const ForgotPasswordPage = lazy(
  () => import("../../features/auth/forgot-password/ForgotPasswordPage"),
);
const ResetPasswordPage = lazy(
  () => import("../../features/auth/reset-password/ResetPasswordPage"),
);
const OnboardingPage = lazy(
  () => import("../../features/onboarding/OnboardingPage"),
);
const DashboardLayout = lazy(
  () => import("../../features/dashboard/DashboardLayout"),
);
const AdminLayout = lazy(() => import("../../features/admin/home/AdminLayout"));
const AdminDashboard = lazy(
  () => import("../../features/admin/home/AdminDashboard"),
);
const ClientListPage = lazy(
  () => import("../../features/admin/client/ClientListPage"),
);
const ClientDetailPage = lazy(
  () => import("../../features/admin/clientDetails/ClientDetailPage"),
);
const AdminPlaceholderPage = lazy(
  () =>
    import("../../features/admin/home/components/AdminPlaceholderPage/AdminPlaceholderPage"),
);
const HomePage = lazy(() => import("../../features/home/Home"));
const JournalPage = lazy(() => import("../../features/journal/Journal"));
const LogMealEntryPage = lazy(
  () => import("../../features/journal/pages/LogMealEntryPage"),
);
const WaterIntakePage = lazy(
  () => import("../../features/journal/pages/WaterIntakePage"),
);
const NutritionAnalysisPage = lazy(
  () => import("../../features/journal/pages/NutritionAnalysisPage"),
);
const GroceryListPage = lazy(
  () => import("../../features/journal/pages/GroceryListPage"),
);
const ProgressPage = lazy(() => import("../../features/progress/ProgressPage"));
const ConsultPage = lazy(() => import("../../features/consult/ConsultPage"));
const ShopPage = lazy(() => import("../../features/shop/ShopPage"));
const ProductDetailPage = lazy(
  () => import("../../features/shop/ProductDetailPage"),
);
const CheckoutPage = lazy(() => import("../../features/shop/CheckoutPage"));
const NotFound = lazy(() => import("../../features/errors/NotFound"));

function withSuspense(element) {
  return createElement(Suspense, { fallback: null }, element);
}

function routeElement(Component, props) {
  return withSuspense(createElement(Component, props));
}

function wrapRoute(Component, children, props) {
  return createElement(Component, props, children);
}

export const router = createBrowserRouter([
  { path: "/", element: routeElement(LandingPage) },

  {
    path: "/signup",
    element: wrapRoute(GuestRoute, routeElement(SignUpPage)),
  },
  {
    path: "/login",
    element: wrapRoute(GuestRoute, routeElement(LoginPage)),
  },
  {
    path: "/forgot-password",
    element: wrapRoute(GuestRoute, routeElement(ForgotPasswordPage)),
  },
  {
    path: "/reset-password",
    element: wrapRoute(GuestRoute, routeElement(ResetPasswordPage)),
  },

  {
    path: "/onboarding",
    element: wrapRoute(ProtectedRoute, routeElement(OnboardingPage), {
      requireOnboarding: false,
    }),
  },

  {
    path: "/dashboard",
    element: wrapRoute(ProtectedRoute, routeElement(DashboardLayout)),
    children: [
      { index: true, element: routeElement(HomePage) },
      {
        path: "journal",
        element: routeElement(JournalPage),
        children: [
          {
            index: true,
            element: createElement(Navigate, {
              to: "log-meal-entry",
              replace: true,
            }),
          },
          {
            path: "log-meal-entry",
            element: routeElement(LogMealEntryPage),
          },
          {
            path: "water-intake",
            element: routeElement(WaterIntakePage),
          },
          {
            path: "nutrition-analysis",
            element: routeElement(NutritionAnalysisPage),
          },
          {
            path: "grocery-list",
            element: routeElement(GroceryListPage),
          },
        ],
      },
      { path: "progress", element: routeElement(ProgressPage) },
      { path: "consult", element: routeElement(ConsultPage) },
      { path: "shop", element: routeElement(ShopPage) },
      { path: "shop/:productId", element: routeElement(ProductDetailPage) },
      { path: "shop/checkout", element: routeElement(CheckoutPage) },
    ],
  },

  {
    path: "/admin",
    element: wrapRoute(ProtectedRoute, routeElement(AdminLayout), {
      requireOnboarding: false,
      requireAdmin: true,
    }),
    children: [
      { index: true, element: routeElement(AdminDashboard) },
      {
        path: "clients",
        element: routeElement(ClientListPage),
      },
      {
        path: "clients/:clientId",
        element: routeElement(ClientDetailPage),
      },
      {
        path: "clients/:clientId/notes",
        element: routeElement(ClientDetailPage, {
          initialTab: "notes",
        }),
      },
      {
        path: "diet-plans",
        element: routeElement(AdminPlaceholderPage, {
          title: "Diet Plans",
          description: "Plan templates and assignment flows are coming next.",
        }),
      },
      {
        path: "diet-plans/build",
        element: routeElement(AdminPlaceholderPage, {
          title: "Build Plan",
          description: "The custom plan builder is under active development.",
        }),
      },
      {
        path: "schedule",
        element: routeElement(AdminPlaceholderPage, {
          title: "Schedule",
          description: "Calendar scheduling will appear here.",
        }),
      },
      {
        path: "consultations",
        element: routeElement(AdminPlaceholderPage, {
          title: "Consultations",
          description: "Consultation history and controls are being connected.",
        }),
      },
      {
        path: "meal-reviews",
        element: routeElement(AdminPlaceholderPage, {
          title: "Meal Reviews",
          description: "Detailed review workflow is in progress.",
        }),
      },
      {
        path: "store/orders",
        element: routeElement(AdminPlaceholderPage, {
          title: "Store Orders",
          description: "Order management panels will be added here.",
        }),
      },
      {
        path: "revenue",
        element: routeElement(AdminPlaceholderPage, {
          title: "Revenue",
          description: "Revenue analytics views are being expanded.",
        }),
      },
      {
        path: "revenue/transactions",
        element: routeElement(AdminPlaceholderPage, {
          title: "Transactions",
          description: "Transaction logs and filters are coming next.",
        }),
      },
      {
        path: "revenue/invoices",
        element: routeElement(AdminPlaceholderPage, {
          title: "Invoices",
          description: "Invoice workflows are being prepared.",
        }),
      },
      {
        path: "settings",
        element: routeElement(AdminPlaceholderPage, {
          title: "Admin Settings",
          description: "Team and configuration settings will appear here.",
        }),
      },
    ],
  },

  { path: "*", element: routeElement(NotFound) },
]);
