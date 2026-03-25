import styles from "./PlatformSection.module.css";
import platform from "../../../assets/platform/platform.webp";

// ── Icons ─────────────────────────────────────────────────────────────────────

function ProfileIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function NutritionIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
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
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function AutomationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
    </svg>
  );
}

const features = [
  {
    id: "profile",
    icon: <ProfileIcon />,
    name: "Personalized Health Journey.",
    description:
      "Smart onboarding with full health profile setup — conditions, dietary preferences, and AI-driven goal selection for weight loss, muscle gain, disease management, and more.",
  },
  {
    id: "nutrition",
    icon: <NutritionIcon />,
    name: "Daily Diet & Nutrition Tracking.",
    description:
      "Log meals across all slots, track calories and macros in real time, upload meal photos for expert review, and search a large nutrition database instantly.",
  },
  {
    id: "progress",
    icon: <ProgressIcon />,
    name: "Progress & Insights Dashboard.",
    description:
      "Real-time weight and body measurement tracking, interactive trend charts, weekly summaries, and daily health insights that guide better habits every day.",
  },
  {
    id: "consult",
    icon: <ConsultIcon />,
    name: "Consultation & Coaching.",
    description:
      "Book sessions with your dietitian, join in-app video calls, receive session summaries with personalised feedback, and get automated reminders so you never miss a session.",
  },
  {
    id: "store",
    icon: <StoreIcon />,
    name: "Integrated Health Store.",
    description:
      "Browse and buy curated wellness products — smoothies, supplements, and health shots — with smart recommendations based on your active goals.",
  },
  {
    id: "automation",
    icon: <AutomationIcon />,
    name: "Smart Automation.",
    description:
      "Meal reminders, auto-generated grocery lists from your diet plan, and activity alerts keep you consistent without any extra effort.",
  },
];

export default function PlatformSection() {
  return (
    <section id="platform" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.layout}>
          {/* ── Left: text + feature list ── */}
          <div className={styles.textCol}>
            <p className={styles.eyebrow}>Platform</p>
            <h2 className={styles.heading}>
              All-in-One Smart Health &amp; Nutrition Platform
            </h2>
            <p className={styles.subtext}>
              Track, manage, and transform your health journey with a powerful,
              personalized digital wellness ecosystem designed for real results.
            </p>

            {/* Feature list */}
            <dl className={styles.featureList}>
              {features.map((f) => (
                <div key={f.id} className={styles.featureItem}>
                  <div className={styles.iconWrap}>{f.icon}</div>
                  <div className={styles.featureText}>
                    <dt className={styles.featureName}>{f.name}</dt>
                    <dd className={styles.featureDesc}>{f.description}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          {/* ── Right: dashboard screenshot ── */}
          <div className={styles.imageCol}>
            <div className={styles.imageFrame}>
              <img
                src={platform}
                alt="App health dashboard showing calorie tracking, water intake, diet plan, and appointment overview"
                className={styles.screenshot}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
