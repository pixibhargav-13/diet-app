// ClientDetailPage — Screen 35: /admin/clients/:id
// Header + 6 tab panels: Overview / Meal Logs / Documents / Progress / Notes / Appointments
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import ClientHeader from "./components/ClientHeader/ClientHeader";
import OverviewTab from "./tabs/OverviewTab/OverviewTab";
import MealLogsTab from "./tabs/MealLogsTab/MealLogsTab";
import DocumentsTab from "./tabs/DocumentsTab/DocumentsTab";
import ProgressTab from "./tabs/ProgressTab/ProgressTab";
import NotesTab from "./tabs/NotesTab/NotesTab";
import AppointmentsTab from "./tabs/AppointmentsTab/AppointmentsTab";
import styles from "./ClientDetailPage.module.css";

// ── Mock client data (replace with GET /admin/clients/:id) ────────────────
const MOCK_CLIENTS = {
  c01: {
    id: "c01",
    name: "Divya Kapoor",
    email: "divya.k@email.com",
    phone: "+91 98765 43210",
    goal: "Weight Loss",
    bmi: 28.4,
    age: 32,
    gender: "Female",
    subscription: "Premium",
    compliance: "High",
    daysInactive: 0,
    joinDate: "Sep 15, 2024",
    assignedPlan: "Mediterranean Weight Loss Plan",
    planAssignedDate: "Oct 1, 2024",
    planVersion: 3,
    planCalories: 1800,
    planMeals: 5,
    planDuration: 12,
    conditions: ["Type 2 Diabetes", "Hypertension"],
    dietaryPrefs: ["Vegetarian", "Gluten-Free"],
    allergies: ["Peanuts"],
    heightCm: 162,
    weightKg: 74.5,
    targetWeightKg: 62,
    bloodGroup: "A+",
    activityLevel: "Moderately Active",
  },
};

const FALLBACK_CLIENT = MOCK_CLIENTS.c01;

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "meal-logs", label: "Meal Logs" },
  { id: "documents", label: "Documents" },
  { id: "progress", label: "Progress" },
  { id: "notes", label: "Notes" },
  { id: "appointments", label: "Appointments" },
];

function resolveInitialTab(initialTab) {
  if (!initialTab) return "overview";
  const matched = TABS.find((tab) => tab.id === initialTab);
  return matched ? matched.id : "overview";
}

export default function ClientDetailPage({ initialTab }) {
  const { clientId } = useParams();
  const client = MOCK_CLIENTS[clientId] ?? FALLBACK_CLIENT;
  const [activeTab, setActiveTab] = useState(resolveInitialTab(initialTab));

  const handleAssignPlan = () => {
    // TODO: open AssignPlanModal
  };

  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/${client.phone.replace(/\D/g, "")}`,
      "_blank",
      "noopener",
    );
  };

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link to="/admin" className={styles.bcLink}>
          Admin
        </Link>
        <span className={styles.bcSep}>›</span>
        <Link to="/admin/clients" className={styles.bcLink}>
          Clients
        </Link>
        <span className={styles.bcSep}>›</span>
        <span className={styles.bcCurrent}>{client.name}</span>
      </nav>

      {/* Client info header */}
      <ClientHeader
        client={client}
        onAssignPlan={handleAssignPlan}
        onWhatsApp={handleWhatsApp}
      />

      {/* ── Tab bar ── */}
      <div
        className={styles.tabBar}
        role="tablist"
        aria-label="Client profile sections"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ""}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab panel ── */}
      <div
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        className={styles.tabPanel}
      >
        {activeTab === "overview" && <OverviewTab client={client} />}
        {activeTab === "meal-logs" && <MealLogsTab />}
        {activeTab === "documents" && <DocumentsTab />}
        {activeTab === "progress" && (
          <ProgressTab targetWeight={client.targetWeightKg} />
        )}
        {activeTab === "notes" && <NotesTab />}
        {activeTab === "appointments" && <AppointmentsTab />}
      </div>
    </div>
  );
}
