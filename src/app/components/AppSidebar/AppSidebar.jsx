import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import { useNutritionStore } from "../../../store/useNutritionStore";
import { toastInfo, toastMealLogged, toastWarning } from "../../../utils/Toast";
import styles from "./AppSidebar.module.css";

const userNav = [
  {
    name: "Home",
    to: "/dashboard",
    end: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    name: "Journal",
    to: "/dashboard/journal",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <line x1="9" y1="8" x2="15" y2="8" />
        <line x1="9" y1="12" x2="13" y2="12" />
      </svg>
    ),
    children: [
      { name: "Log Meal Entry", to: "/dashboard/journal/log-meal-entry" },
      { name: "Water Intake", to: "/dashboard/journal/water-intake" },
      {
        name: "Nutrition analysis",
        to: "/dashboard/journal/nutrition-analysis",
      },
      { name: "Grocery list", to: "/dashboard/journal/grocery-list" },
    ],
  },
  {
    name: "Progress",
    to: "/dashboard/progress",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    name: "Consult",
    to: "/dashboard/consult",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    name: "Shop",
    to: "/dashboard/shop",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
    children: [
      { name: "Product", to: "/dashboard/shop", end: true },
      { name: "Checkout", to: "/dashboard/shop/checkout", end: true },
    ],
  },
];

const adminNav = [
  {
    name: "Overview",
    to: "/admin",
    end: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    name: "Clients",
    to: "/admin/clients",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    name: "Diet Plans",
    to: "/admin/diet-plans",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    children: [
      { name: "All Plans", to: "/admin/diet-plans", end: true },
      { name: "Build Plan", to: "/admin/diet-plans/build", end: true },
    ],
  },
  {
    name: "Scheduling",
    to: "/admin/schedule",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    children: [
      { name: "Calendar", to: "/admin/schedule", end: true },
      { name: "Consultations", to: "/admin/consultations", end: true },
      { name: "Meal Reviews", to: "/admin/meal-reviews", end: true },
    ],
  },
  {
    name: "Orders",
    to: "/admin/store/orders",
    end: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    name: "Revenue",
    to: "/admin/revenue",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    children: [
      { name: "Dashboard", to: "/admin/revenue", end: true },
      { name: "Transactions", to: "/admin/revenue/transactions", end: true },
      { name: "Invoices", to: "/admin/revenue/invoices", end: true },
    ],
  },
  {
    name: "Settings",
    to: "/admin/settings",
    end: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
      </svg>
    ),
  },
];

function itemMatchesPath(item, pathname) {
  if (pathname.startsWith(item.to)) return true;
  if (!item.children) return false;
  return item.children.some((child) => pathname.startsWith(child.to));
}

export default function AppSidebar({ mode, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();
  const quickLogNextMeal = useNutritionStore((state) => state.quickLogNextMeal);
  const isDismissible = typeof onClose === "function";

  const nav = mode === "admin" ? adminNav : userNav;
  const expandableNames = useMemo(
    () => nav.filter((item) => !!item.children).map((item) => item.name),
    [nav],
  );

  const [expanded, setExpanded] = useState(() => {
    const init = {};
    expandableNames.forEach((name) => {
      init[name] = false;
    });
    return init;
  });

  useEffect(() => {
    setExpanded((prev) => {
      const next = { ...prev };
      expandableNames.forEach((name) => {
        if (!(name in next)) next[name] = false;
      });
      return next;
    });
  }, [expandableNames]);

  useEffect(() => {
    nav.forEach((item) => {
      if (item.children && itemMatchesPath(item, location.pathname)) {
        setExpanded((prev) => ({ ...prev, [item.name]: true }));
      }
    });
  }, [location.pathname, nav]);

  const handleLogout = () => {
    logout();
    onClose?.();
    navigate("/login", { replace: true });
  };

  const handleQuickLog = () => {
    const result = quickLogNextMeal("Sidebar Quick Log");

    if (result.ok) {
      toastMealLogged();
      return;
    }

    if (result.reason === "NO_PENDING_MEALS") {
      toastInfo("All planned meals for today are already logged.");
      return;
    }

    toastWarning("Unable to quick-log right now.");
  };

  const handlePrimaryAction = () => {
    if (mode === "admin") {
      onClose?.();
      navigate("/dashboard");
      return;
    }

    handleQuickLog();
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.logoRow}>
        <div>
          <span className={styles.logo}>Vitals</span>
          {mode === "admin" ? (
            <span className={styles.adminTag}>Admin</span>
          ) : null}
        </div>

        {isDismissible ? (
          <button
            type="button"
            onClick={onClose}
            className={styles.closeBtn}
            aria-label="Close sidebar"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        ) : null}
      </div>

      <nav
        className={styles.nav}
        aria-label={
          mode === "admin" ? "Admin navigation" : "Dashboard navigation"
        }
      >
        <ul className={styles.navList}>
          {nav.map((item) => {
            const hasChildren = !!item.children;
            const isOpen = !!expanded[item.name];

            if (hasChildren) {
              return (
                <li key={item.name}>
                  <button
                    type="button"
                    onClick={() =>
                      setExpanded((prev) => ({
                        ...prev,
                        [item.name]: !prev[item.name],
                      }))
                    }
                    className={`${styles.navLink} ${isOpen ? styles.navLinkActive : ""} ${isOpen ? styles.navLinkOpen : ""} ${styles.navButton}`}
                    aria-expanded={isOpen}
                  >
                    <span className={styles.navIcon}>{item.icon}</span>
                    <span className={styles.navLabel}>{item.name}</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`${styles.chevronIcon} ${isOpen ? styles.chevronOpen : ""}`}
                      aria-hidden="true"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {isOpen ? (
                    <ul className={styles.subnavList}>
                      {item.children.map((child) => (
                        <li key={child.name}>
                          <NavLink
                            to={child.to}
                            end={!!child.end}
                            onClick={onClose}
                            className={({ isActive }) =>
                              `${styles.subnavLink} ${isActive ? styles.subnavLinkActive : ""}`
                            }
                          >
                            {child.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            }

            return (
              <li key={item.name}>
                <NavLink
                  to={item.to}
                  end={!!item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`
                  }
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  {item.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className={styles.bottom}>
        <button
          type="button"
          className={styles.primaryActionBtn}
          onClick={handlePrimaryAction}
        >
          {mode === "admin" ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.primaryActionIcon}
            >
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.primaryActionIcon}
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          )}
          {mode === "admin" ? "Back to App" : "Log Activity"}
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className={styles.logoutBtn}
          aria-label="Sign out"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.logoutIcon}
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign out
        </button>
      </div>
    </div>
  );
}

AppSidebar.propTypes = {
  mode: PropTypes.oneOf(["user", "admin"]).isRequired,
  onClose: PropTypes.func,
};
