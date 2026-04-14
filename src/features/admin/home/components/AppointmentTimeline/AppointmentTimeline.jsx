// AppointmentTimeline — upcoming appointments with time, client, status
import PropTypes from "prop-types";
import AdminPanel from "../AdminPanel/AdminPanel";
import styles from "./AppointmentTimeline.module.css";

const STATUS_MAP = {
  confirmed: { label: "Confirmed", cls: "confirmed" },
  pending: { label: "Pending", cls: "pending" },
  sent: { label: "Link Sent", cls: "sent" },
};

export default function AppointmentTimeline({ appointments }) {
  const viewAll = (
    <button type="button" className={styles.viewAllBtn}>
      View Calendar →
    </button>
  );

  return (
    <AdminPanel
      title="Today's Appointments"
      right={viewAll}
      icon={
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
      }
    >
      {appointments.length === 0 ? (
        <p className={styles.empty}>No appointments today.</p>
      ) : (
        <div className={styles.timeline}>
          {appointments.map((appt, i) => {
            const s = STATUS_MAP[appt.status] ?? STATUS_MAP.pending;
            return (
              <div key={appt.id} className={styles.item}>
                {/* Time + connector */}
                <div className={styles.timeCol}>
                  <span className={styles.time}>{appt.time}</span>
                  {i < appointments.length - 1 && (
                    <div className={styles.connector} />
                  )}
                </div>
                {/* Dot */}
                <div className={`${styles.dot} ${styles[`dot_${s.cls}`]}`} />
                {/* Content */}
                <div className={styles.content}>
                  <div className={styles.contentTop}>
                    <span className={styles.clientName}>{appt.clientName}</span>
                    <span className={`${styles.statusBadge} ${styles[s.cls]}`}>
                      {s.label}
                    </span>
                  </div>
                  <span className={styles.type}>
                    {appt.type} · {appt.duration}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminPanel>
  );
}

AppointmentTimeline.propTypes = {
  appointments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      clientName: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      duration: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
