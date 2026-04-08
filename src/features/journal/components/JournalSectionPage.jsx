import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styles from "./JournalSectionPage.module.css";

export default function JournalSectionPage({ title, description }) {
    return (
        <section className={styles.page}>
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                <Link to="/dashboard" className={styles.breadcrumbLink}>
                    Home
                </Link>
                <span className={styles.separator}>/</span>
                <span className={styles.crumbMuted}>Journal</span>
                <span className={styles.separator}>/</span>
                <span className={styles.crumbCurrent}>{title}</span>
            </nav>

            <header className={styles.header}>
                <h1 className={styles.title}>{title}</h1>
                <p className={styles.description}>{description}</p>
            </header>

            <div className={styles.bodyCard}>
                <p className={styles.bodyHint}>
                    This section is ready for implementation.
                </p>
            </div>
        </section>
    );
}

JournalSectionPage.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
};