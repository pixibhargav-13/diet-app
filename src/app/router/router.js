import { Suspense, createElement, lazy } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

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
const ProgressPage = lazy(() => import("../../features/progress/ProgressPage"));
const ConsultPage = lazy(() => import("../../features/consult/Consult"));
const ShopPage = lazy(() => import("../../features/shop/Shop"));
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
                ],
            },
            { path: "progress", element: routeElement(ProgressPage) },
            { path: "consult", element: routeElement(ConsultPage) },
            { path: "shop", element: routeElement(ShopPage) },
        ],
    },

    { path: "*", element: routeElement(NotFound) },
]);