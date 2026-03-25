import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";
import Navbar from "../landing/components/Navbar";
import Footer from "../landing/components/Footer";
import ScrollTopButton from "../landing/components/ScrollTopButton";
import ErrorImage from "../../assets/error/404.webp";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className={styles.page}>
        {/* Background */}
        <img
          src={ErrorImage}
          alt="Calm"
          aria-hidden="true"
          className={styles.bg}
        />
        <div className={styles.overlay} aria-hidden="true" />

        {/* Content */}
        <div className={styles.content}>
          <p className={styles.code}>404</p>
          <h1 className={styles.heading}>Page not found</h1>
          <p className={styles.subtext}>
            Sorry, we couldn't find the page you're looking for. It may have
            moved or no longer exists.
          </p>
          <Link to="/" className={styles.backLink}>
            <span aria-hidden="true">←</span> Back to home
          </Link>
        </div>
      </main>
      <Footer />
      <ScrollTopButton />
    </>
  );
}
