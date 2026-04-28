// Sidebar — nav items + Log Activity button only (user info lives in Topbar)
import { useState } from "react";
import PropTypes from "prop-types";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import { useNutritionStore } from "../../../store/useNutritionStore";
import { toastInfo, toastMealLogged, toastWarning } from "../../../utils/Toast";
import styles from "./Sidebar.module.css";

const NAV = [
  {
    name: "Home",
    to: "/dashboard",
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
      {
        name: "Log Meal Entry",
        to: "/dashboard/journal/log-meal-entry",
      },
      {
        name: "Water Intake",
        to: "/dashboard/journal/water-intake",
      },
      {
        name: "Nutrition analysis",
        to: "/dashboard/journal/nutrition-analysis",
      },
      {
        name: "Grocery list",
        to: "/dashboard/journal/grocery-list",
      },
      {
        name: "Food Lookup",
        to: "/dashboard/journal/food-lookup",
      },
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
    name: "Sessions",
    to: "/dashboard/sessions",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        <circle cx="12" cy="3" r="1"/>
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
      {
        name: "Product",
        to: "/dashboard/shop",
      },
      {
        name: "Checkout",
        to: "/dashboard/shop/checkout",
      },
    ],
  },
];

export default function Sidebar({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();
  const quickLogNextMeal = useNutritionStore((state) => state.quickLogNextMeal);
  const isDismissible = typeof onClose === "function";
  const [journalExpanded, setJournalExpanded] = useState(
    location.pathname.startsWith("/dashboard/journal")
  );
  const [shopExpanded, setShopExpanded] = useState(
    location.pathname.startsWith("/dashboard/shop")
  );

  const handleLogout = () => {
    logout();
    onClose?.();
    navigate("/login", { replace: true });
  };

  const handleJournalToggle = () => {
    setJournalExpanded((currentValue) => !currentValue);
  };

  const handleShopToggle = () => {
    setShopExpanded((currentValue) => !currentValue);
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

  return (
    <div className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logoRow}>
        <span className={styles.logo}>Vitals</span>
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

      {/* Nav */}
      <nav className={styles.nav} aria-label="Dashboard navigation">
        <ul className={styles.navList}>
          {NAV.map((item) => {
            const isJournal = item.name === "Journal";
            const isShop = item.name === "Shop";
            const isJournalRoute = location.pathname.startsWith("/dashboard/journal");
            const isShopRoute = location.pathname.startsWith("/dashboard/shop");
            const isJournalExpanded = isJournalRoute || journalExpanded;
            const isShopExpanded = isShopRoute || shopExpanded;

            return (
              <li key={item.name}>
                {isJournal ? (
                  <>
                    <button
                      type="button"
                      onClick={handleJournalToggle}
                      className={`${styles.navLink} ${isJournalExpanded ? styles.navLinkActive : ""} ${isJournalExpanded ? styles.navLinkOpen : ""
                        } ${styles.navButton}`}
                      aria-expanded={isJournalExpanded}
                      aria-controls="journal-submenu"
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
                        className={`${styles.chevronIcon} ${isJournalExpanded ? styles.chevronOpen : ""
                          }`}
                        aria-hidden="true"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    {isJournalExpanded ? (
                      <ul id="journal-submenu" className={styles.subnavList}>
                        {item.children.map((child) => (
                          <li key={child.name}>
                            <NavLink
                              to={child.to}
                              onClick={onClose}
                              className={({ isActive }) =>
                                `${styles.subnavLink} ${isActive ? styles.subnavLinkActive : ""
                                }`
                              }
                            >
                              {child.name}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </>
                ) : isShop ? (
                  <>
                    <button
                      type="button"
                      onClick={handleShopToggle}
                      className={`${styles.navLink} ${isShopExpanded ? styles.navLinkActive : ""} ${isShopExpanded ? styles.navLinkOpen : ""
                        } ${styles.navButton}`}
                      aria-expanded={isShopExpanded}
                      aria-controls="shop-submenu"
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
                        className={`${styles.chevronIcon} ${isShopExpanded ? styles.chevronOpen : ""
                          }`}
                        aria-hidden="true"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    {isShopExpanded ? (
                      <ul id="shop-submenu" className={styles.subnavList}>
                        {item.children.map((child) => (
                          <li key={child.name}>
                            <NavLink
                              to={child.to}
                              end={child.to === "/dashboard/shop"}
                              onClick={onClose}
                              className={({ isActive }) =>
                                `${styles.subnavLink} ${isActive ? styles.subnavLinkActive : ""
                                }`
                              }
                            >
                              {child.name}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </>
                ) : (
                  <NavLink
                    to={item.to}
                    end={item.to === "/dashboard"}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `${styles.navLink} ${isActive ? styles.navLinkActive : ""
                      }`
                    }
                  >
                    <span className={styles.navIcon}>{item.icon}</span>
                    {item.name}
                  </NavLink>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom — Log Activity + logout */}
      <div className={styles.bottom}>
        <button type="button" className={styles.logActivityBtn} onClick={handleQuickLog}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.plusIcon}
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Log Activity
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

Sidebar.propTypes = { onClose: PropTypes.func };
