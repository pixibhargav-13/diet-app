import { useEffect, useState } from "react";
import styles from "./ScrollTopButton.module.css";

export default function ScrollTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > 280);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      className={`${styles.button} ${isVisible ? styles.visible : styles.hidden}`}
      onClick={handleScrollTop}
      aria-label="Scroll to top"
    >
      <svg viewBox="0 0 20 20" fill="currentColor" className={styles.icon}>
        <path
          fillRule="evenodd"
          d="M10 3.75a.75.75 0 0 1 .53.22l4 4a.75.75 0 1 1-1.06 1.06L10.75 6.31V16a.75.75 0 0 1-1.5 0V6.31L6.53 9.03a.75.75 0 1 1-1.06-1.06l4-4a.75.75 0 0 1 .53-.22Z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}
