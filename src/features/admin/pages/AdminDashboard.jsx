import { useAuthStore } from '../../../store/useAuthStore'
import { CLIENTS, ACTIVITY_FEED } from '../data/adminMockData'
import styles from './AdminDashboard.module.css'

const STATS = [
  { label: 'Total Clients',     value: '48',      sub: '+3 this month',     color: 'blue' },
  { label: 'Active Today',      value: '12',      sub: '25% of clients',    color: 'green' },
  { label: 'Sessions This Week', value: '8',      sub: '2 today',           color: 'purple' },
  { label: 'Monthly Revenue',   value: '₹1,24,500', sub: '↑ 18% vs last month', color: 'orange' },
]

const ACTIVITY_ICONS = {
  meal:        '🍽️',
  water:       '💧',
  consult:     '📋',
  appointment: '📅',
  progress:    '📊',
  document:    '📄',
}

export default function AdminDashboard() {
  const user = useAuthStore((s) => s.user)
  const alerts = CLIENTS.filter((c) => c.daysInactive >= 3)

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.heading}>Welcome back, {user?.firstName}!</h1>
          <p className={styles.sub}>Here&apos;s what&apos;s happening with your clients today.</p>
        </div>
        <span className={styles.date}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {STATS.map((s) => (
          <div key={s.label} className={`${styles.statCard} ${styles[s.color]}`}>
            <p className={styles.statLabel}>{s.label}</p>
            <p className={styles.statValue}>{s.value}</p>
            <p className={styles.statSub}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Alerts + Activity feed */}
      <div className={styles.mainGrid}>

        {/* Inactive alerts */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <p className={styles.cardTitle}>
              <span className={styles.alertDot} />
              Inactive Clients
            </p>
            <span className={styles.badge}>{alerts.length} alerts</span>
          </div>
          {alerts.length === 0 ? (
            <p className={styles.emptyMsg}>All clients are active — great job!</p>
          ) : (
            <div className={styles.alertList}>
              {alerts.map((c) => (
                <div key={c.id} className={styles.alertRow}>
                  <div className={styles.alertAvatar}>{c.name[0]}</div>
                  <div className={styles.alertInfo}>
                    <p className={styles.alertName}>{c.name}</p>
                    <p className={styles.alertSub}>No meal log for {c.daysInactive} day{c.daysInactive !== 1 ? 's' : ''}</p>
                  </div>
                  <span className={`${styles.complianceBadge} ${c.compliance < 50 ? styles.badLow : styles.badWarn}`}>
                    {c.compliance}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity feed */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <p className={styles.cardTitle}>Today&apos;s Activity</p>
            <span className={styles.badge}>{ACTIVITY_FEED.length} events</span>
          </div>
          <div className={styles.feedList}>
            {ACTIVITY_FEED.map((item) => (
              <div key={item.id} className={styles.feedRow}>
                <span className={styles.feedIcon}>{ACTIVITY_ICONS[item.type]}</span>
                <div className={styles.feedInfo}>
                  <p className={styles.feedClient}>{item.client}</p>
                  <p className={styles.feedAction}>{item.action}</p>
                </div>
                <span className={styles.feedTime}>{item.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Quick client overview */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <p className={styles.cardTitle}>Client Overview</p>
          <a href="/admin/clients" className={styles.viewAll}>View all →</a>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Client</th>
                <th>Goal</th>
                <th>Plan</th>
                <th>Compliance</th>
                <th>Status</th>
                <th>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {CLIENTS.slice(0, 6).map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className={styles.clientCell}>
                      <div className={styles.avatar}>{c.name[0]}</div>
                      <div>
                        <p className={styles.clientName}>{c.name}</p>
                        <p className={styles.clientEmail}>{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className={styles.goalTag}>{c.goal}</span></td>
                  <td className={styles.planCell}>{c.plan}</td>
                  <td>
                    <div className={styles.complianceCell}>
                      <div className={styles.complianceBar}>
                        <div className={styles.complianceFill} style={{ width: `${c.compliance}%`, background: c.compliance >= 70 ? '#22c55e' : c.compliance >= 50 ? '#f59e0b' : '#ef4444' }} />
                      </div>
                      <span className={styles.compliancePct}>{c.compliance}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles['s' + c.status]}`}>{c.status}</span>
                  </td>
                  <td className={styles.dateCell}>{c.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
