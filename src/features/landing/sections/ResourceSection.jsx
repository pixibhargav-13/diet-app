import styles from "./ResourceSection.module.css";


function VaultIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 9V7M12 17v-2M9 12H7M17 12h-2" />
    </svg>
  );
}

function InsightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  );
}

function DietPlanIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="12" y2="17" />
    </svg>
  );
}

function ReportIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
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

function PrivacyIcon() {
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
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function SupportIcon() {
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

// ── Feature data ──────────────────────────────────────────────────────────────

const features = [
  {
    id: "vault",
    icon: <VaultIcon />,
    name: "Health Records & Document Vault",
    description:
      "Securely upload and store blood reports, prescriptions, and medical history — always accessible for consultations and progress reviews.",
  },
  {
    id: "insights",
    icon: <InsightIcon />,
    name: "Expert Guidance & Insights",
    description:
      "Personalized diet plans from professionals, daily health tips, and session notes with compliance tracking after every consultation.",
  },
  {
    id: "plans",
    icon: <DietPlanIcon />,
    name: "Custom Diet Plans",
    description:
      "Structured day-wise meal plans with portion guidance, tailored to your goals and conditions, and downloadable for easy reference.",
  },
  {
    id: "reports",
    icon: <ReportIcon />,
    name: "Reports & Analytics",
    description:
      "Detailed progress reports across weight, nutrition, and activity — exportable for personal tracking or medical consultations.",
  },
  {
    id: "store",
    icon: <StoreIcon />,
    name: "Wellness Resources & Products",
    description:
      "Curated health products aligned with your diet plan, complete with ratings, reviews, and subscription reorder options.",
  },
  {
    id: "privacy",
    icon: <PrivacyIcon />,
    name: "Privacy & Security",
    description:
      "Role-based access control, secure data handling, and full privacy compliance — so you stay in complete control of your health data.",
  },
  {
    id: "support",
    icon: <SupportIcon />,
    name: "Support System",
    description:
      "Chat with dietitians via the app or WhatsApp, request quick consultations for urgent queries, and stay on track with automated reminders.",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function ResourceSection() {
  return (
    <section
      id="resources"
      className={styles.section}
      style={{ scrollMarginTop: "88px" }}
    >
      <div className={styles.container}>
        <div className={styles.layout}>
          {/* ── Left: sticky heading ── */}
          <div className={styles.textCol}>
            <p className={styles.eyebrow}>Resources</p>
            <h2 className={styles.heading}>
              Everything You Need to Succeed, Backed by Expertise
            </h2>
            <p className={styles.subtext}>
              Beyond tracking — get access to expert guidance, powerful tools,
              and resources that make your health journey simple and
              sustainable.
            </p>
            <p className={styles.cta}>
              "Your health journey doesn't need to be complicated — we provide
              everything in one place."
            </p>
          </div>

          {/* ── Right: 2-col feature grid ── */}
          <dl className={styles.featureGrid}>
            {features.map((f) => (
              <div key={f.id} className={styles.feature}>
                <dt>
                  <div className={styles.iconWrap}>{f.icon}</div>
                  <span className={styles.featureName}>{f.name}</span>
                </dt>
                <dd className={styles.featureDesc}>{f.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
