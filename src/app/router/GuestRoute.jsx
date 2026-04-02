import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

export default function GuestRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return children;

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
