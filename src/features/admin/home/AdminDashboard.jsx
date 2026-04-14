// AdminDashboard — Screen 33: /admin
// Central overview for the dietitian — stats, alerts, timeline, queue, revenue
import StatCard from "./components/StatCard/StatCard";
import InactiveAlerts from "./components/InactiveAlerts/InactiveAlerts";
import AppointmentTimeline from "./components/AppointmentTimeline/AppointmentTimeline";
import MealReviewQueue from "./components/MealReviewQueue/MealReviewQueue";
import RevenueSnapshot from "./components/RevenueSnapshot/RevenueSnapshot";
import styles from "./AdminDashboard.module.css";

// ── Mock data (replace with API calls) ────────────────────────────────────

const STATS = [
  {
    id: "clients",
    label: "Total Clients",
    value: "48",
    sub: "+3 this month",
    tone: "default",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: "active",
    label: "Active Today",
    value: "31",
    sub: "65% of total",
    tone: "success",
    icon: (
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
    ),
  },
  {
    id: "appointments",
    label: "Appointments Today",
    value: "6",
    sub: "2 pending confirmation",
    tone: "warn",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    id: "orders",
    label: "Pending Orders",
    value: "9",
    sub: "3 require action",
    tone: "alert",
    icon: (
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
    ),
  },
];

const INACTIVE_CLIENTS = [
  { id: "ic1", name: "Rohan Mehta", daysAgo: 5, goal: "Weight Loss" },
  { id: "ic2", name: "Priya Sharma", daysAgo: 4, goal: "Muscle Gain" },
  { id: "ic3", name: "Ankit Joshi", daysAgo: 7, goal: "Diabetes Mgmt." },
];

const APPOINTMENTS = [
  {
    id: "a1",
    time: "09:30 AM",
    clientName: "Divya Kapoor",
    type: "Regular Consult",
    duration: "45 min",
    status: "confirmed",
  },
  {
    id: "a2",
    time: "11:00 AM",
    clientName: "Sanjay Verma",
    type: "Follow-up",
    duration: "30 min",
    status: "pending",
  },
  {
    id: "a3",
    time: "01:00 PM",
    clientName: "Meera Nair",
    type: "Regular Consult",
    duration: "45 min",
    status: "sent",
  },
  {
    id: "a4",
    time: "03:30 PM",
    clientName: "Arjun Patel",
    type: "Emergency Consult",
    duration: "30 min",
    status: "confirmed",
  },
  {
    id: "a5",
    time: "05:00 PM",
    clientName: "Nisha Gupta",
    type: "Diet Plan Review",
    duration: "60 min",
    status: "pending",
  },
];

const MEAL_REVIEWS = [
  {
    id: "mr1",
    clientName: "Divya K.",
    mealSlot: "Breakfast",
    date: "Today",
    reviewed: false,
    photoUrl: "",
  },
  {
    id: "mr2",
    clientName: "Rohan M.",
    mealSlot: "Lunch",
    date: "Today",
    reviewed: false,
    photoUrl: "",
  },
  {
    id: "mr3",
    clientName: "Meera N.",
    mealSlot: "Dinner",
    date: "Yesterday",
    reviewed: true,
    photoUrl: "",
  },
  {
    id: "mr4",
    clientName: "Sanjay V.",
    mealSlot: "Snacks",
    date: "Yesterday",
    reviewed: false,
    photoUrl: "",
  },
  {
    id: "mr5",
    clientName: "Priya S.",
    mealSlot: "Breakfast",
    date: "Yesterday",
    reviewed: true,
    photoUrl: "",
  },
  {
    id: "mr6",
    clientName: "Ankit J.",
    mealSlot: "Lunch",
    date: "2 days ago",
    reviewed: false,
    photoUrl: "",
  },
];

const REVENUE_DATA = [
  { label: "Nov 1", value: 18400 },
  { label: "Nov 5", value: 22100 },
  { label: "Nov 10", value: 19800 },
  { label: "Nov 15", value: 31200 },
  { label: "Nov 20", value: 28500 },
  { label: "Nov 25", value: 34700 },
  { label: "Nov 30", value: 41200 },
];

// ── Page ──────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className={styles.page}>
      {/* Page header */}
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.kicker}>Admin Panel</p>
          <h1 className={styles.heading}>Dashboard Overview</h1>
          <p className={styles.date}>{today}</p>
        </div>
        {/* <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.notifBtn}
            aria-label="Notifications"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="18"
              height="18"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className={styles.notifDot} />
          </button>
          <div className={styles.adminAvatar}>DN</div>
        </div> */}
      </header>

      {/* ── Stats row ── */}
      <div className={styles.statsGrid}>
        {STATS.map((s) => (
          <StatCard
            key={s.id}
            label={s.label}
            value={s.value}
            sub={s.sub}
            icon={s.icon}
            tone={s.tone}
          />
        ))}
      </div>

      {/* ── Row 2: Inactive alerts + Appointment timeline ── */}
      <div className={styles.midGrid}>
        <InactiveAlerts clients={INACTIVE_CLIENTS} />
        <AppointmentTimeline appointments={APPOINTMENTS} />
      </div>

      {/* ── Row 3: Meal review queue (full width) ── */}
      <MealReviewQueue items={MEAL_REVIEWS} />

      {/* ── Row 4: Revenue snapshot ── */}
      <RevenueSnapshot
        data={REVENUE_DATA}
        total={195900}
        packages={142000}
        products={62400}
        refunds={8500}
      />
    </div>
  );
}
