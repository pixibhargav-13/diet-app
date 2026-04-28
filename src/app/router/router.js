import { Suspense, createElement, lazy } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import AdminRoute from "./AdminRoute";

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
const LogMealEntryPage = lazy(() =>
    import("../../features/journal/pages/LogMealEntryPage")
);
const WaterIntakePage = lazy(() =>
    import("../../features/journal/pages/WaterIntakePage")
);
const NutritionAnalysisPage = lazy(() =>
    import("../../features/journal/pages/NutritionAnalysisPage")
);
const GroceryListPage = lazy(() =>
    import("../../features/journal/pages/GroceryListPage")
);
const FoodSearchPage = lazy(() =>
    import("../../features/journal/pages/FoodSearchPage")
);
const ProgressPage = lazy(() => import("../../features/progress/ProgressPage"));
const ConsultPage = lazy(() => import("../../features/consult/ConsultPage"));
const ShopPage = lazy(() => import("../../features/shop/ShopPage"));
const ProductDetailPage = lazy(() => import("../../features/shop/ProductDetailPage"));
const CheckoutPage = lazy(() => import("../../features/shop/CheckoutPage"));
const NotFound = lazy(() => import("../../features/errors/NotFound"));
const AdminLayout = lazy(() => import("../../features/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("../../features/admin/pages/AdminDashboard"));
const ClientManagement = lazy(() => import("../../features/admin/pages/ClientManagement"));
const DietPlanManagement = lazy(() => import("../../features/admin/pages/DietPlanManagement"));
const StoreInventory = lazy(() => import("../../features/admin/pages/StoreInventory"));
const RevenuePayments = lazy(() => import("../../features/admin/pages/RevenuePayments"));
const SchedulingConsultations = lazy(() => import("../../features/admin/pages/SchedulingConsultations"));
const SessionScheduler = lazy(() => import("../../features/admin/pages/SessionScheduler"));
const PackageManagement = lazy(() => import("../../features/admin/pages/PackageManagement"));
const PolicySettings = lazy(() => import("../../features/admin/pages/PolicySettings"));
const MySessionsPage = lazy(() => import("../../features/sessions/MySessionsPage"));

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
        element: wrapRoute(
            ProtectedRoute,
            routeElement(OnboardingPage),
            { requireOnboarding: false }
        ),
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
                    {
                        path: "food-lookup",
                        element: routeElement(FoodSearchPage),
                    },
                ],
            },
            { path: "progress", element: routeElement(ProgressPage) },
            { path: "consult", element: routeElement(ConsultPage) },
            { path: "shop", element: routeElement(ShopPage) },
            { path: "shop/:productId", element: routeElement(ProductDetailPage) },
            { path: "shop/checkout", element: routeElement(CheckoutPage) },
            { path: "sessions", element: routeElement(MySessionsPage) },
        ],
    },

    {
        path: "/admin",
        element: wrapRoute(AdminRoute, routeElement(AdminLayout)),
        children: [
            { index: true,          element: routeElement(AdminDashboard) },
            { path: "clients",      element: routeElement(ClientManagement) },
            { path: "diet-plans",   element: routeElement(DietPlanManagement) },
            { path: "store",        element: routeElement(StoreInventory) },
            { path: "revenue",      element: routeElement(RevenuePayments) },
            { path: "scheduling",   element: routeElement(SchedulingConsultations) },
            { path: "sessions",     element: routeElement(SessionScheduler) },
            { path: "packages",     element: routeElement(PackageManagement) },
            { path: "policies",     element: routeElement(PolicySettings) },
        ],
    },

    { path: "*", element: routeElement(NotFound) },
]);