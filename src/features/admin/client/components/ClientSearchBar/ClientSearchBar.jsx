// ClientSearchBar — search, dropdown checkbox filters, sort
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./ClientSearchBar.module.css";

const GOAL_FILTERS = [
  "Weight Loss",
  "Muscle Gain",
  "Diabetes Mgmt.",
  "Heart Health",
  "General Wellness",
];

const ACTIVITY_FILTERS = [
  "Active Today",
  "Active This Week",
  "Inactive 3+ Days",
];

const HEALTH_ISSUE_FILTERS = [
  "Diabetes",
  "Hypertension",
  "PCOS",
  "Thyroid",
  "Fatty Liver",
  "High Cholesterol",
  "Sleep Apnea",
  "Migraine",
];

const SORT_OPTIONS = [
  { value: "name", label: "Name" },
  { value: "last_active", label: "Last Active" },
  { value: "join_date", label: "Join Date" },
];

function parseList(value) {
  if (!value) return [];
  return value.split(",").filter(Boolean);
}

export default function ClientSearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDropdown, setOpenDropdown] = useState("");
  const filterRowRef = useRef(null);

  const q = searchParams.get("q") ?? "";
  const goal = parseList(searchParams.get("goal"));
  const activity = parseList(searchParams.get("activity"));
  const healthIssue = parseList(searchParams.get("healthIssue"));
  const sortBy = searchParams.get("sort") ?? "name";

  const updateParam = (key, val, options = {}) =>
    setSearchParams((prev) => {
      const shouldDelete =
        val == null ||
        String(val).trim() === "" ||
        (options.defaultValue != null && val === options.defaultValue);

      if (shouldDelete) {
        prev.delete(key);
      } else {
        prev.set(key, val);
      }
      return prev;
    });

  const toggleArrayValue = (key, currentList, value) => {
    const next = currentList.includes(value)
      ? currentList.filter((item) => item !== value)
      : [...currentList, value];

    setSearchParams((prev) => {
      if (next.length === 0) {
        prev.delete(key);
      } else {
        prev.set(key, next.join(","));
      }
      return prev;
    });
  };

  const labelFor = (items, emptyLabel) => {
    if (items.length === 0) return emptyLabel;
    if (items.length === 1) return items[0];
    return `${items.length} selected`;
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!filterRowRef.current?.contains(event.target)) {
        setOpenDropdown("");
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className={styles.wrap}>
      {/* ── Search row ── */}
      <div className={styles.searchRow}>
        <div className={styles.inputWrap}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.searchIcon}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            value={q}
            onChange={(e) => updateParam("q", e.target.value)}
            placeholder="Search by name, goal or email…"
            className={styles.searchInput}
            aria-label="Search clients"
          />
          {q && (
            <button
              type="button"
              onClick={() => updateParam("q", "")}
              className={styles.clearQBadge}
              aria-label="Clear search"
            >
              <span>Clear</span>
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                width="12"
                height="12"
              >
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </button>
          )}
        </div>

        {/* Sort */}
        <div className={styles.sortWrap}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.sortIcon}
            aria-hidden="true"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="6" y1="12" x2="18" y2="12" />
            <line x1="9" y1="18" x2="15" y2="18" />
          </svg>
          <select
            value={sortBy}
            onChange={(e) =>
              updateParam("sort", e.target.value, { defaultValue: "name" })
            }
            className={styles.sortSelect}
            aria-label="Sort clients"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.sortChevron}
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* ── Filter dropdown groups ── */}
      <div className={styles.filtersRow} ref={filterRowRef}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Goal</label>
          <div className={styles.dropdown}>
            <button
              type="button"
              className={styles.dropdownSummary}
              onClick={() =>
                setOpenDropdown((current) => (current === "goal" ? "" : "goal"))
              }
              aria-expanded={openDropdown === "goal"}
            >
              {labelFor(goal, "All Goals")}
            </button>
            {openDropdown === "goal" ? (
              <div className={styles.dropdownPanel}>
                {GOAL_FILTERS.map((item) => (
                  <label key={item} className={styles.checkboxRow}>
                    <input
                      type="checkbox"
                      checked={goal.includes(item)}
                      onChange={() => toggleArrayValue("goal", goal, item)}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Activity</label>
          <div className={styles.dropdown}>
            <button
              type="button"
              className={styles.dropdownSummary}
              onClick={() =>
                setOpenDropdown((current) =>
                  current === "activity" ? "" : "activity",
                )
              }
              aria-expanded={openDropdown === "activity"}
            >
              {labelFor(activity, "All Activity")}
            </button>
            {openDropdown === "activity" ? (
              <div className={styles.dropdownPanel}>
                {ACTIVITY_FILTERS.map((item) => (
                  <label key={item} className={styles.checkboxRow}>
                    <input
                      type="checkbox"
                      checked={activity.includes(item)}
                      onChange={() =>
                        toggleArrayValue("activity", activity, item)
                      }
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Health Issue</label>
          <div className={styles.dropdown}>
            <button
              type="button"
              className={styles.dropdownSummary}
              onClick={() =>
                setOpenDropdown((current) =>
                  current === "healthIssue" ? "" : "healthIssue",
                )
              }
              aria-expanded={openDropdown === "healthIssue"}
            >
              {labelFor(healthIssue, "All Health Issues")}
            </button>
            {openDropdown === "healthIssue" ? (
              <div className={styles.dropdownPanel}>
                {HEALTH_ISSUE_FILTERS.map((item) => (
                  <label key={item} className={styles.checkboxRow}>
                    <input
                      type="checkbox"
                      checked={healthIssue.includes(item)}
                      onChange={() =>
                        toggleArrayValue("healthIssue", healthIssue, item)
                      }
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
