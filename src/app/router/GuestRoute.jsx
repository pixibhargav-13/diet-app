import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

export default function GuestRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();

  const from = location.state?.from;

  if (!isAuthenticated) return children;

  if (user?.onboardingComplete && from) {
    return <Navigate to={from} replace />;
  }

  return (
    <Navigate
      to={user?.onboardingComplete ? "/dashboard" : "/onboarding"}
      replace
    />
  );
}

GuestRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
