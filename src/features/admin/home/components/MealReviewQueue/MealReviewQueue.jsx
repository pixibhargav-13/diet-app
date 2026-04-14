// MealReviewQueue — meal photos awaiting dietitian feedback
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import AdminPanel from "../AdminPanel/AdminPanel";
import styles from "./MealReviewQueue.module.css";

const SLOT_COLORS = {
  Breakfast: "#fff8e1",
  Lunch: "#eef4fa",
  Dinner: "#fff0f0",
  Snacks: "#f5f0ff",
};

export default function MealReviewQueue({ items }) {
  const headerRight = (
    <>
      <span className={styles.pendingBadge}>
        {items.filter((i) => !i.reviewed).length} pending
      </span>
      <Link to="/admin/meal-reviews" className={styles.viewAllBtn}>
        View All →
      </Link>
    </>
  );

  return (
    <AdminPanel
      title="Meal Photo Review Queue"
      right={headerRight}
      icon={
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      }
    >
      {items.length === 0 ? (
        <p className={styles.empty}>No photos pending review.</p>
      ) : (
        <div className={styles.grid}>
          {items.slice(0, 6).map((item) => (
            <div key={item.id} className={styles.photoCard}>
              {/* Photo area — no real image, placeholder bg */}
              <div
                className={styles.photoWrap}
                style={{ background: item.reviewed ? "#f0fdf4" : "#fff8e1" }}
              >
                {item.photoUrl ? (
                  <img
                    src={item.photoUrl}
                    alt={`${item.clientName} ${item.mealSlot}`}
                    className={styles.photo}
                  />
                ) : (
                  <div className={styles.photoPlaceholder}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={styles.photoIcon}
                    >
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </div>
                )}
                {/* Reviewed overlay */}
                {item.reviewed && (
                  <div className={styles.reviewedOverlay}>
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      width="16"
                      height="16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Meta */}
              <div className={styles.meta}>
                <span className={styles.clientName}>{item.clientName}</span>
                <div className={styles.metaRow}>
                  <span
                    className={styles.slot}
                    style={{
                      background: SLOT_COLORS[item.mealSlot] ?? "#f3f4f6",
                    }}
                  >
                    {item.mealSlot}
                  </span>
                  <span className={styles.date}>{item.date}</span>
                </div>
                {item.reviewed ? (
                  <span className={styles.reviewedBadge}>Reviewed</span>
                ) : (
                  <Link
                    to={`/admin/meal-reviews?id=${item.id}`}
                    className={styles.reviewBtn}
                  >
                    Review →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminPanel>
  );
}

MealReviewQueue.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      clientName: PropTypes.string.isRequired,
      mealSlot: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      reviewed: PropTypes.bool.isRequired,
      photoUrl: PropTypes.string,
    }),
  ).isRequired,
};
