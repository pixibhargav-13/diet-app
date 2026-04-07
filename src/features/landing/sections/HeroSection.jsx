import styles from "./HeroSection.module.css";
import PropTypes from "prop-types";
import home1 from "../../../assets/home/home-1.webp";
import home2 from "../../../assets/home/home-2.webp";
function Star({ filled }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill={filled ? "#D4A72C" : "#E5E7EB"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

Star.propTypes = {
  filled: PropTypes.bool,
};

export default function HeroSection() {
  return (
    <section
      id="home"
      className={styles.hero}
      style={{ scrollMarginTop: "88px" }}
    >
      <main>
        <div className={styles.inner}>
          {/* Background grid */}
          <svg aria-hidden="true" className={styles.bgGrid}>
            <defs>
              <pattern
                id="hero-grid"
                x="50%"
                y={-1}
                width={200}
                height={200}
                patternUnits="userSpaceOnUse"
              >
                <path d="M.5 200V.5H200" fill="none" />
              </pattern>
            </defs>
            <svg
              x="50%"
              y={-1}
              style={{ overflow: "visible", fill: "#eef4fa" }}
            >
              <path
                d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect
              fill="url(#hero-grid)"
              width="100%"
              height="100%"
              strokeWidth={0}
            />
          </svg>

          <div className={styles.container}>
            <div className={styles.layout}>
              <div className={styles.leftCol}>
                <h1 className={styles.heading}>
                  Your journey to a healthier you
                </h1>

                <p className={styles.subtext}>
                  In a world moving faster than ever, App turns wellness data
                  into clarity you can act on.
                </p>

                <div className={styles.ctaRow}>
                  <a href="/signup" className={styles.btnPrimary}>
                    Get started
                  </a>
                  <a href="/demo" className={styles.btnSecondary}>
                    Live demo <span aria-hidden="true">→</span>
                  </a>
                </div>

                <div className={styles.progressCard}>
                  <div className={styles.progressHeader}>
                    <div className={styles.progressIcon}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#2a4365"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <p className={styles.progressLabel}>Daily Progress</p>
                  </div>

                  <div className={styles.progressBarTrack}>
                    <div className={styles.progressBarFill} />
                  </div>

                  <p className={styles.questionLabel}>Question</p>
                  <p className={styles.questionText}>
                    How easy was it to track your nutrition today?
                  </p>

                  <div className={styles.progressFooter}>
                    <div className={styles.stars}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} filled={i <= 3} />
                      ))}
                    </div>
                    <span className={styles.responseCount}>342 Responses</span>
                  </div>
                </div>
              </div>

              <div className={styles.rightCol}>
                <div className={styles.insightCard}>
                  <div className={styles.insightLeft}>
                    <p className={styles.insightEyebrow}>Health Tracking</p>
                    <h3 className={styles.insightTitle}>Discovery insights</h3>
                    <p className={styles.insightSub}>Daily wellness overview</p>
                  </div>
                  <div className={styles.insightStats}>
                    <div className={styles.insightStat}>
                      <p className={styles.statLabel}>Updates</p>
                      <p className={styles.statValue}>24</p>
                    </div>
                    <div className={styles.insightStat}>
                      <p className={styles.statLabel}>Active Goals</p>
                      <p className={styles.statValue}>8</p>
                    </div>
                  </div>
                </div>

                {/* Visual grid */}
                <div className={styles.visualGrid}>
                  {/* Panel 1 — activity colour block */}
                  <div className={`${styles.panel} ${styles.panelActivity}`}>
                    <div className={styles.activityOrb} />
                  </div>

                  {/* Panel 2 — yoga / workout photo */}
                  <div className={`${styles.panel} ${styles.panelPhoto}`}>
                    <img src={home1} alt="Workout session" />
                  </div>

                  {/* Panel 3 — mindfulness + live overlay */}
                  <div className={`${styles.panel} ${styles.panelMindful}`}>
                    <img src={home2} alt="Mindfulness session" />
                    <div className={styles.liveOverlay}>
                      <div className={styles.playBtn}>
                        <svg
                          viewBox="0 0 20 20"
                          fill="white"
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          height="10"
                        >
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                      <div className={styles.liveInfo}>
                        <p className={styles.liveEyebrow}>Live Session</p>
                        <p className={styles.liveTitle}>Evening Mindfulness</p>
                        <div className={styles.liveBar}>
                          <div className={styles.liveBarFill} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}
