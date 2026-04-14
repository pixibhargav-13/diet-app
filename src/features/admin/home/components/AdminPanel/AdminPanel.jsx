import PropTypes from "prop-types";
import styles from "./AdminPanel.module.css";

export default function AdminPanel({
  title,
  icon,
  right,
  children,
  tone = "default",
}) {
  return (
    <section className={`${styles.panel} ${styles[tone] || ""}`}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
          <h2 className={styles.title}>{title}</h2>
        </div>
        {right ? <div className={styles.right}>{right}</div> : null}
      </header>
      {children}
    </section>
  );
}

AdminPanel.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  right: PropTypes.node,
  children: PropTypes.node.isRequired,
  tone: PropTypes.oneOf(["default", "alert"]),
};
