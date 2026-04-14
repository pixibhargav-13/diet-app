import PropTypes from "prop-types";
import styles from "./AdminPlaceholderPage.module.css";

export default function AdminPlaceholderPage({ title, description }) {
  return (
    <section className={styles.card}>
      <p className={styles.kicker}>Admin Module</p>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>
    </section>
  );
}

AdminPlaceholderPage.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
