import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useOnboardingStore } from "../../store/useOnboardingStore";

export default function ProtectedRoute({ children, requireOnboarding = true }) {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const { isOnboardingComplete } = useOnboardingStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (
    requireOnboarding &&
    !isOnboardingComplete &&
    location.pathname !== "/onboarding"
  ) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,

  requireOnboarding: PropTypes.bool,
};
