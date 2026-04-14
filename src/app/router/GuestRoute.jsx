import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

function getDefaultPath(user) {
  if (!user?.onboardingComplete) return "/onboarding";
  return user?.role === "admin" ? "/admin" : "/dashboard";
}

function resolveFromPath(from) {
  if (!from) return "";
  if (typeof from === "string") return from;
  return from.pathname ?? "";
}

export default function GuestRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();

  const from = location.state?.from;
  const fromPath = resolveFromPath(from);
  const isAdmin = user?.role === "admin";

  if (!isAuthenticated) return children;

  if (user?.onboardingComplete && fromPath) {
    if (isAdmin) {
      return (
        <Navigate
          to={fromPath.startsWith("/admin") ? fromPath : "/admin"}
          replace
        />
      );
    }

    if (!fromPath.startsWith("/admin")) {
      return <Navigate to={fromPath} replace />;
    }
  }

  return <Navigate to={getDefaultPath(user)} replace />;
}

GuestRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
