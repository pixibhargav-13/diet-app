import { useState, useMemo } from 'react'
import { CLIENTS } from '../data/adminMockData'
import styles from './ClientManagement.module.css'

const GOALS = ['All', 'Weight Loss', 'Weight Gain', 'Muscle Gain', 'Disease Mgmt', 'Maintenance']
const STATUSES = ['All', 'Active', 'Alert', 'Inactive']

const MOCK_MEAL_LOGS = [
  { time: '8:30 AM', meal: 'Oats with banana & almonds', kcal: 350, type: 'Breakfast' },
  { time: '1:00 PM', meal: 'Grilled chicken salad',      kcal: 420, type: 'Lunch' },
  { time: '4:00 PM', meal: 'Apple + peanut butter',      kcal: 200, type: 'Snack' },
]

export default function ClientManagement() {
  const [search, setSearch] = useState('')
  const [goalFilter, setGoalFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortBy, setSortBy] = useState('name')
  const [selectedClient, setSelectedClient] = useState(null)
  const [tab, setTab] = useState('profile')
  const [feedback, setFeedback] = useState('')
  const [feedbackSaved, setFeedbackSaved] = useState(false)
  const [notes, setNotes] = useState('')
  const [notesSaved, setNotesSaved] = useState(false)

  const filtered = useMemo(() => {
    let list = CLIENTS
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
    }
    if (goalFilter !== 'All') list = list.filter((c) => c.goal === goalFilter)
    if (statusFilter !== 'All') list = list.filter((c) => c.status === statusFilter)
    return [...list].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'compliance') return b.compliance - a.compliance
      if (sortBy === 'lastActive') return b.lastActive.localeCompare(a.lastActive)
      return 0
    })
  }, [search, goalFilter, statusFilter, sortBy])

  const handleSaveFeedback = () => {
    setFeedbackSaved(true)
    setTimeout(() => setFeedbackSaved(false), 2000)
  }

  const handleSaveNotes = () => {
    setNotesSaved(true)
    setTimeout(() => setNotesSaved(false), 2000)
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.heading}>Client Management</h1>
          <p className={styles.sub}>View and manage all your clients&apos; profiles, logs and compliance.</p>
        </div>
        <div className={styles.totalBadge}>{CLIENTS.length} total clients</div>
      </div>

      {/* Filters */}
      <div className={styles.filterBar}>
        <div className={styles.searchWrap}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" className={styles.searchIcon}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className={styles.searchInput}
          />
        </div>
        <select value={goalFilter} onChange={(e) => setGoalFilter(e.target.value)} className={styles.select}>
          {GOALS.map((g) => <option key={g} value={g}>Goal: {g}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={styles.select}>
          {STATUSES.map((s) => <option key={s} value={s}>Status: {s}</option>)}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={styles.select}>
          <option value="name">Sort: Name</option>
          <option value="compliance">Sort: Compliance</option>
          <option value="lastActive">Sort: Last Active</option>
        </select>
      </div>

      {/* Table */}
      <div className={styles.card}>
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className={styles.row}>
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
                  <td>
                    <button type="button" className={styles.viewBtn} onClick={() => { setSelectedClient(c); setTab('profile') }}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className={styles.emptyRow}>No clients match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client detail drawer */}
      {selectedClient && (
        <div className={styles.drawerOverlay} onClick={() => setSelectedClient(null)}>
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <div className={styles.drawerAvatar}>{selectedClient.name[0]}</div>
              <div className={styles.drawerMeta}>
                <p className={styles.drawerName}>{selectedClient.name}</p>
                <p className={styles.drawerEmail}>{selectedClient.email}</p>
              </div>
              <button type="button" className={styles.closeBtn} onClick={() => setSelectedClient(null)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className={styles.drawerTabs}>
              {['profile', 'meal-logs', 'feedback', 'notes'].map((t) => (
                <button key={t} type="button" className={`${styles.drawerTab} ${tab === t ? styles.drawerTabActive : ''}`} onClick={() => setTab(t)}>
                  {t === 'meal-logs' ? 'Meal Logs' : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            <div className={styles.drawerContent}>
              {tab === 'profile' && (
                <div className={styles.profileGrid}>
                  {[
                    ['Goal', selectedClient.goal],
                    ['Current Plan', selectedClient.plan],
                    ['Status', selectedClient.status],
                    ['Compliance', `${selectedClient.compliance}%`],
                    ['Last Active', selectedClient.lastActive],
                    ['Days Inactive', selectedClient.daysInactive],
                    ['Health Condition', 'PCOD, Thyroid (mock)'],
                    ['Dietary Preference', 'Vegetarian (mock)'],
                    ['Allergies', 'None (mock)'],
                  ].map(([label, val]) => (
                    <div key={label} className={styles.profileField}>
                      <p className={styles.profileLabel}>{label}</p>
                      <p className={styles.profileVal}>{val}</p>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'meal-logs' && (
                <div className={styles.mealLogList}>
                  <p className={styles.sectionNote}>Today&apos;s meal logs</p>
                  {MOCK_MEAL_LOGS.map((m, i) => (
                    <div key={i} className={styles.mealLogRow}>
                      <div className={styles.mealLogDot} />
                      <div className={styles.mealLogInfo}>
                        <p className={styles.mealLogName}>{m.meal}</p>
                        <p className={styles.mealLogMeta}>{m.type} · {m.time} · {m.kcal} kcal</p>
                      </div>
                    </div>
                  ))}
                  <div className={styles.photoSection}>
                    <p className={styles.sectionNote}>Meal photo (mock)</p>
                    <div className={styles.photoPlaceholder}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28" style={{ color: '#9ca3af' }}>
                        <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <span>Meal photo submitted</span>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'feedback' && (
                <div className={styles.feedbackSection}>
                  <p className={styles.sectionNote}>Leave feedback on meal photos</p>
                  <textarea
                    className={styles.textarea}
                    rows={5}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="e.g. Great portion control! Consider reducing oil in dinner…"
                  />
                  <button type="button" className={styles.saveBtn} onClick={handleSaveFeedback}>
                    {feedbackSaved ? '✓ Saved' : 'Save Feedback'}
                  </button>
                </div>
              )}

              {tab === 'notes' && (
                <div className={styles.feedbackSection}>
                  <p className={styles.sectionNote}>Session notes &amp; compliance score</p>
                  <div className={styles.complianceRow}>
                    <span className={styles.profileLabel}>Compliance Score</span>
                    <span className={styles.bigScore}>{selectedClient.compliance}%</span>
                  </div>
                  <textarea
                    className={styles.textarea}
                    rows={5}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Follow-up notes from today's session…"
                  />
                  <button type="button" className={styles.saveBtn} onClick={handleSaveNotes}>
                    {notesSaved ? '✓ Saved' : 'Save Notes'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
