import styles from "./SolutionSection.module.css";

function JournalIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <line x1="9" y1="7" x2="15" y2="7" />
      <line x1="9" y1="11" x2="15" y2="11" />
    </svg>
  );
}

function ConsultIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <line x1="9" y1="10" x2="15" y2="10" />
      <line x1="12" y1="7" x2="12" y2="13" />
    </svg>
  );
}

function ProgressIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function CheckBullet() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={styles.bullet}>
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
        clipRule="evenodd"
      />
    </svg>
  );
}


const solutions = [
  {
    id: "journal",
    icon: <JournalIcon />,
    heading: "Daily Diet Journal",
    text: "Log every meal across all your daily slots and stay on top of your nutrition with smart calorie and macro tracking.",
    features: [
      "Log Breakfast, Lunch, Dinner, Snacks & Workout meals",
      "Daily calorie & macro breakdown — Protein, Carbs, Fat",
      "Track water intake with a visual glass counter",
      "Smart grocery list from your assigned diet plan",
    ],
  },
  {
    id: "consult",
    icon: <ConsultIcon />,
    heading: "Expert Consultations",
    text: "Book sessions with your dietitian, join video calls, and get personalised notes — all without leaving the app.",
    features: [
      "Book appointments with available date & time slots",
      "Video consultations directly inside the app",
      "Session summary with dietitian notes after each call",
      "Emergency / quick consultation request option",
    ],
  },
  {
    id: "progress",
    icon: <ProgressIcon />,
    heading: "Progress Tracking",
    text: "Monitor your health journey with interactive charts, body measurements, and weekly summaries that keep you motivated.",
    features: [
      "Log daily weight & body measurements",
      "Interactive weight trend charts over time",
      "Weekly & monthly progress summary notifications",
      "Manual step count entry",
    ],
  },
];


export default function SolutionSection() {
  return (
    <section
      id="solutions"
      className={styles.section}
      style={{ scrollMarginTop: "88px" }}
    >
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <p className={styles.eyebrow}>What we offer</p>
          <h2 className={styles.heading}>Everything you need in one place</h2>
          <p className={styles.subtext}>
            From daily meal logging to expert dietitian consultations — App
            gives you the tools to take control of your health.
          </p>
        </div>

        {/* Cards */}
        <div className={styles.grid}>
          {solutions.map((s) => (
            <div key={s.id} className={styles.card}>
              {/* Icon + heading */}
              <div className={styles.cardTop}>
                <div className={styles.iconWrap}>{s.icon}</div>
                <h3 className={styles.cardHeading}>{s.heading}</h3>
              </div>

              {/* Description */}
              <p className={styles.cardText}>{s.text}</p>

              {/* Feature list */}
              <ul className={styles.featureList}>
                {s.features.map((f) => (
                  <li key={f} className={styles.featureItem}>
                    <CheckBullet />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
