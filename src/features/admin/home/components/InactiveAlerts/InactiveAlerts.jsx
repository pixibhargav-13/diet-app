// InactiveAlerts — clients not logged in for 3+ days
import PropTypes from "prop-types";
import AdminPanel from "../AdminPanel/AdminPanel";
import styles from "./InactiveAlerts.module.css";

export default function InactiveAlerts({ clients }) {
  const badge = <span className={styles.badge}>{clients.length} clients</span>;

  return (
    <AdminPanel
      title="Inactive Client Alerts"
      tone="alert"
      right={badge}
      icon={
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      }
    >
      {clients.length === 0 ? (
        <p className={styles.empty}>All clients are active — great work!</p>
      ) : (
        <ul className={styles.list} role="list">
          {clients.map((c) => (
            <li key={c.id} className={styles.row}>
              <div className={styles.avatar}>
                {c.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className={styles.info}>
                <span className={styles.name}>{c.name}</span>
                <span className={styles.sub}>
                  Last active {c.daysAgo} days ago · {c.goal}
                </span>
              </div>
              <div className={styles.actions}>
                <span className={styles.flagBadge}>{c.daysAgo}d inactive</span>
                <button type="button" className={styles.actionBtn}>
                  Send Reminder
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AdminPanel>
  );
}

InactiveAlerts.propTypes = {
  clients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      daysAgo: PropTypes.number.isRequired,
      goal: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
