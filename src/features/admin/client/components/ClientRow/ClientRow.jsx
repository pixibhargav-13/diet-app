// ClientRow — one client in the list
// Shared: used in ClientListPage; can also drop into search results, ClientDetail sidebar, etc.
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import styles from "./ClientRow.module.css";

export default function ClientRow({ client }) {
  const navigate = useNavigate();
  const isInactive = client.daysInactive >= 3;

  const initials = client.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`${styles.row} ${isInactive ? styles.rowInactive : ""}`}
      onClick={() => navigate(`/admin/clients/${client.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) =>
        (e.key === "Enter" || e.key === " ") &&
        navigate(`/admin/clients/${client.id}`)
      }
      aria-label={`View ${client.name}'s profile`}
    >
      {/* Avatar */}
      <div className={styles.avatarCol}>
        <div
          className={`${styles.avatar} ${isInactive ? styles.avatarInactive : ""}`}
        >
          {initials}
        </div>
        {isInactive && (
          <span
            className={styles.inactiveDot}
            title={`${client.daysInactive} days inactive`}
            aria-label="Inactive"
          />
        )}
      </div>

      {/* Name + email */}
      <div className={styles.nameCol}>
        <span className={styles.name}>
          {client.name}
          {isInactive && (
            <span className={styles.inactiveBadge} aria-label="Inactive client">
              {client.daysInactive}d inactive
            </span>
          )}
        </span>
        <span className={styles.email}>{client.email}</span>
      </div>

      {/* Goal */}
      <div className={styles.goalCol}>
        <span className={styles.goal}>{client.goal}</span>
      </div>

      {/* Health Issue */}
      <div className={styles.issueCol}>
        <span className={styles.issueBadge}>{client.healthIssue}</span>
      </div>

      {/* Last active */}
      <div className={styles.activeCol}>
        <span
          className={`${styles.lastActive} ${isInactive ? styles.lastActiveAlert : ""}`}
        >
          {isInactive ? `${client.daysInactive} days ago` : client.lastActive}
        </span>
      </div>

      {/* Actions */}
      <div
        className={styles.actionsCol}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="group"
        aria-label={`Actions for ${client.name}`}
      >
        <button
          type="button"
          onClick={() => navigate(`/admin/clients/${client.id}`)}
          className={styles.actionBtn}
          title="View profile"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
            <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
            <path
              fillRule="evenodd"
              d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => navigate(`/admin/clients/${client.id}/notes`)}
          className={styles.actionBtn}
          title="Add note"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
            <path d="M2.695 14.763l-1.262 3.154a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.885L17.5 5.5a2.121 2.121 0 0 0-3-3L3.58 13.42a4 4 0 0 0-.885 1.343Z" />
          </svg>
        </button>
        <button
          type="button"
          className={`${styles.actionBtn} ${styles.actionBtnWhatsapp}`}
          title="WhatsApp"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

ClientRow.propTypes = {
  client: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    goal: PropTypes.string.isRequired,
    healthIssue: PropTypes.string.isRequired,
    lastActive: PropTypes.string.isRequired,
    daysInactive: PropTypes.number.isRequired,
  }).isRequired,
};
