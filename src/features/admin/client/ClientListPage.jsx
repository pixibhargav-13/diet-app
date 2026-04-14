// ClientListPage — Screen 34: /admin/clients
// Search + dropdown checkbox filters (URL-synced), table header, client rows
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ClientSearchBar from "./components/ClientSearchBar/ClientSearchBar";
import ClientRow from "./components/ClientRow/ClientRow";
import styles from "./ClientListPage.module.css";

// ── Mock data ─────────────────────────────────────────────────────────────
const ALL_CLIENTS = [
  {
    id: "c01",
    name: "Divya Kapoor",
    email: "divya.k@email.com",
    goal: "Weight Loss",
    healthIssue: "PCOS",
    lastActive: "Today",
    daysInactive: 0,
  },
  {
    id: "c02",
    name: "Rohan Mehta",
    email: "rohan.m@email.com",
    goal: "Weight Loss",
    healthIssue: "Fatty Liver",
    lastActive: "5 days ago",
    daysInactive: 5,
  },
  {
    id: "c03",
    name: "Priya Sharma",
    email: "priya.s@email.com",
    goal: "Muscle Gain",
    healthIssue: "Thyroid",
    lastActive: "4 days ago",
    daysInactive: 4,
  },
  {
    id: "c04",
    name: "Sanjay Verma",
    email: "sanjay.v@email.com",
    goal: "General Wellness",
    healthIssue: "Hypertension",
    lastActive: "Yesterday",
    daysInactive: 1,
  },
  {
    id: "c05",
    name: "Meera Nair",
    email: "meera.n@email.com",
    goal: "Heart Health",
    healthIssue: "High Cholesterol",
    lastActive: "Today",
    daysInactive: 0,
  },
  {
    id: "c06",
    name: "Arjun Patel",
    email: "arjun.p@email.com",
    goal: "Diabetes Mgmt.",
    healthIssue: "Diabetes",
    lastActive: "2 days ago",
    daysInactive: 2,
  },
  {
    id: "c07",
    name: "Nisha Gupta",
    email: "nisha.g@email.com",
    goal: "Weight Loss",
    healthIssue: "PCOS",
    lastActive: "Today",
    daysInactive: 0,
  },
  {
    id: "c08",
    name: "Ankit Joshi",
    email: "ankit.j@email.com",
    goal: "Diabetes Mgmt.",
    healthIssue: "Diabetes",
    lastActive: "7 days ago",
    daysInactive: 7,
  },
  {
    id: "c09",
    name: "Pooja Reddy",
    email: "pooja.r@email.com",
    goal: "Muscle Gain",
    healthIssue: "Migraine",
    lastActive: "Today",
    daysInactive: 0,
  },
  {
    id: "c10",
    name: "Vikram Singh",
    email: "vikram.s@email.com",
    goal: "General Wellness",
    healthIssue: "Hypertension",
    lastActive: "3 days ago",
    daysInactive: 3,
  },
  {
    id: "c11",
    name: "Kavya Iyer",
    email: "kavya.i@email.com",
    goal: "Heart Health",
    healthIssue: "High Cholesterol",
    lastActive: "Today",
    daysInactive: 0,
  },
  {
    id: "c12",
    name: "Rahul Bose",
    email: "rahul.b@email.com",
    goal: "Weight Loss",
    healthIssue: "Sleep Apnea",
    lastActive: "14 days ago",
    daysInactive: 14,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────
function parseCsvParam(value) {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function matchesGoal(client, filters) {
  if (filters.length === 0) return true;
  return filters.includes(client.goal);
}

function matchesActivity(client, filters) {
  if (filters.length === 0) return true;
  if (filters.includes("Active Today") && client.daysInactive === 0)
    return true;
  if (filters.includes("Active This Week") && client.daysInactive <= 7)
    return true;
  if (filters.includes("Inactive 3+ Days") && client.daysInactive >= 3)
    return true;
  return false;
}

function matchesHealthIssue(client, filters) {
  if (filters.length === 0) return true;
  return filters.includes(client.healthIssue);
}

function matchesSearch(client, q) {
  if (!q.trim()) return true;
  const lq = q.toLowerCase();
  return (
    client.name.toLowerCase().includes(lq) ||
    client.email.toLowerCase().includes(lq) ||
    client.goal.toLowerCase().includes(lq) ||
    client.healthIssue.toLowerCase().includes(lq)
  );
}

function sortClients(clients, sortBy) {
  const c = [...clients];
  if (sortBy === "name") return c.sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === "last_active")
    return c.sort((a, b) => a.daysInactive - b.daysInactive);
  if (sortBy === "join_date") return c; // keep original (mock: insertion order = join order)
  return c;
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function ClientListPage() {
  const [searchParams] = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const goalFilters = parseCsvParam(searchParams.get("goal"));
  const activityFilters = parseCsvParam(searchParams.get("activity"));
  const healthIssueFilters = parseCsvParam(searchParams.get("healthIssue"));
  const sortBy = searchParams.get("sort") ?? "name";

  const filtered = useMemo(() => {
    const f = ALL_CLIENTS.filter(
      (c) =>
        matchesGoal(c, goalFilters) &&
        matchesActivity(c, activityFilters) &&
        matchesHealthIssue(c, healthIssueFilters) &&
        matchesSearch(c, q),
    );
    return sortClients(f, sortBy);
  }, [q, goalFilters, activityFilters, healthIssueFilters, sortBy]);

  const inactiveCount = ALL_CLIENTS.filter((c) => c.daysInactive >= 3).length;

  return (
    <div className={styles.page}>
      {/* Page header */}
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.kicker}>Admin · Clients</p>
          <h1 className={styles.heading}>Client List</h1>
          <p className={styles.sub}>
            {ALL_CLIENTS.length} total clients
            {inactiveCount > 0 && (
              <span className={styles.inactiveCount}>
                {" "}
                · {inactiveCount} inactive
              </span>
            )}
          </p>
        </div>
        <button type="button" className={styles.addClientBtn}>
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
          Add Client
        </button>
      </header>

      {/* Search + filters */}
      <ClientSearchBar />

      {/* Results summary */}
      <div className={styles.resultsMeta}>
        <span className={styles.resultsCount}>
          Showing <strong>{filtered.length}</strong> of {ALL_CLIENTS.length}{" "}
          clients
        </span>
        {filtered.length !== ALL_CLIENTS.length && (
          <span className={styles.filteringNote}>— filters applied</span>
        )}
      </div>

      {/* Table */}
      <div className={styles.tableWrap}>
        {/* Column headers */}
        <div className={styles.tableHead}>
          <div className={styles.thAvatar} />
          <div className={styles.th}>Client</div>
          <div className={styles.th}>Goal</div>
          <div className={styles.th}>Health Issue</div>
          <div className={styles.th}>Last Active</div>
          <div className={styles.thActions} />
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.emptyIcon}
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <p className={styles.emptyTitle}>No clients found</p>
            <p className={styles.emptyDesc}>
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className={styles.tbody}>
            {filtered.map((client) => (
              <ClientRow key={client.id} client={client} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
