import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useOnboardingStore } from "../../store/useOnboardingStore";

export default function GuestRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  const { isOnboardingComplete } = useOnboardingStore();

  if (!isAuthenticated) return children;

  return (
    <Navigate
      to={isOnboardingComplete ? "/dashboard" : "/onboarding"}
      replace
    />
  );
}

GuestRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
