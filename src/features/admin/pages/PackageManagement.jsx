import { useState, useMemo } from 'react'
import { useYogaSessionStore } from '../../../store/useYogaSessionStore'
import { CLIENTS } from '../data/adminMockData'
import styles from './PackageManagement.module.css'

const EMPTY_FORM = { clientId: '', name: '', sessionCount: 5, price: '' }

function UsageBar({ used, total }) {
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0
  return (
    <div className={styles.usageBar}>
      <div className={styles.usageTrack}>
        <div className={styles.usageFill} style={{ width: `${pct}%`, background: pct >= 80 ? '#ef4444' : pct >= 60 ? '#f59e0b' : '#22c55e' }} />
      </div>
      <span className={styles.usageLabel}>{used}/{total} sessions used</span>
    </div>
  )
}

export default function PackageManagement() {
  const { packages, addPackage, updatePackage, deletePackage } = useYogaSessionStore()

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState(null)
  const [clientFilter, setClientFilter] = useState('all')
  const [confirmDelete, setConfirmDelete] = useState(null)

  const filtered = useMemo(() => {
    return packages.filter((p) => clientFilter === 'all' || p.clientId === clientFilter)
  }, [packages, clientFilter])

  const summary = useMemo(() => ({
    total: packages.length,
    active: packages.filter((p) => p.active).length,
    totalSessions: packages.reduce((a, p) => a + p.sessionCount, 0),
    usedSessions: packages.reduce((a, p) => a + p.sessionsUsed, 0),
  }), [packages])

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true) }

  const openEdit = (pkg) => {
    setForm({ clientId: pkg.clientId, name: pkg.name, sessionCount: pkg.sessionCount, price: pkg.price })
    setEditId(pkg.id)
    setShowForm(true)
  }

  const handleFormChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.clientId || !form.name || !form.price) return
    const client = CLIENTS.find((c) => c.id === form.clientId)
    const data = { ...form, clientName: client?.name ?? form.clientId, sessionCount: Number(form.sessionCount), price: Number(form.price), active: true }

    if (editId) {
      updatePackage(editId, data)
    } else {
      addPackage(data)
    }
    setShowForm(false)
    setForm(EMPTY_FORM)
    setEditId(null)
  }

  const handleDeactivate = (id) => updatePackage(id, { active: false })
  const handleActivate = (id) => updatePackage(id, { active: true })

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.heading}>Package Management</h1>
          <p className={styles.sub}>Create custom session packages, track usage and pricing per client.</p>
        </div>
        <button type="button" className={styles.newBtn} onClick={openCreate}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Package
        </button>
      </div>

      {/* Summary stats */}
      <div className={styles.statsRow}>
        {[
          { label: 'Total Packages', value: summary.total },
          { label: 'Active Packages', value: summary.active },
          { label: 'Total Sessions Sold', value: summary.totalSessions },
          { label: 'Sessions Consumed', value: summary.usedSessions },
        ].map((s, i) => (
          <div key={s.label} className={styles.statCard} style={{ borderLeftColor: ['#2a4365','#22c55e','#7c3aed','#f59e0b'][i] }}>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className={styles.filterRow}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Filter by Client</label>
          <select className={styles.filterSelect} value={clientFilter} onChange={(e) => setClientFilter(e.target.value)}>
            <option value="all">All Clients</option>
            {CLIENTS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <span className={styles.filterCount}>{filtered.length} package{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Package cards grid */}
      <div className={styles.packagesGrid}>
        {filtered.length === 0 && (
          <div className={styles.empty}>
            <p>No packages found. Create one to get started.</p>
          </div>
        )}
        {filtered.map((pkg) => {
          const remaining = pkg.sessionCount - pkg.sessionsUsed
          return (
            <div key={pkg.id} className={`${styles.pkgCard} ${!pkg.active ? styles.pkgCardInactive : ''}`}>
              <div className={styles.pkgHeader}>
                <div>
                  <p className={styles.pkgName}>{pkg.name}</p>
                  <p className={styles.pkgClient}>{pkg.clientName}</p>
                </div>
                <div className={styles.pkgActions}>
                  <button type="button" className={styles.editBtn} onClick={() => openEdit(pkg)}>Edit</button>
                  {pkg.active
                    ? <button type="button" className={styles.deactivateBtn} onClick={() => handleDeactivate(pkg.id)}>Deactivate</button>
                    : <button type="button" className={styles.activateBtn} onClick={() => handleActivate(pkg.id)}>Activate</button>
                  }
                  <button type="button" className={styles.deleteBtn} onClick={() => setConfirmDelete(pkg)}>Delete</button>
                </div>
              </div>

              <div className={styles.pkgMeta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Price</span>
                  <span className={styles.metaValue}>₹{pkg.price.toLocaleString('en-IN')}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Remaining</span>
                  <span className={`${styles.metaValue} ${remaining <= 1 ? styles.lowSessions : ''}`}>{remaining} sessions</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Created</span>
                  <span className={styles.metaValue}>{pkg.createdAt}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Status</span>
                  <span className={`${styles.statusBadge} ${pkg.active ? styles.statusActive : styles.statusInactive}`}>
                    {pkg.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <UsageBar used={pkg.sessionsUsed} total={pkg.sessionCount} />
            </div>
          )
        })}
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
        <div className={styles.overlay} onClick={() => setShowForm(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <p className={styles.modalTitle}>{editId ? 'Edit Package' : 'Create New Package'}</p>
              <button type="button" className={styles.modalClose} onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className={styles.modalBody}>
              <div className={styles.formGrid}>
                <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>Client *</label>
                  <select name="clientId" className={styles.input} value={form.clientId} onChange={handleFormChange} required>
                    <option value="">Select client…</option>
                    {CLIENTS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>Package Name *</label>
                  <input type="text" name="name" className={styles.input} value={form.name} onChange={handleFormChange} placeholder="e.g. Yoga Starter, 10-Session Bundle…" required />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Number of Sessions *</label>
                  <select name="sessionCount" className={styles.input} value={form.sessionCount} onChange={handleFormChange}>
                    {[3,5,8,10,12,15,20,25].map((n) => <option key={n} value={n}>{n} sessions</option>)}
                  </select>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Price (₹) *</label>
                  <input type="number" name="price" className={styles.input} value={form.price} onChange={handleFormChange} placeholder="e.g. 4500" min="0" required />
                </div>
              </div>
              {form.sessionCount && form.price && (
                <p className={styles.priceNote}>
                  ₹{Math.round(Number(form.price) / Number(form.sessionCount)).toLocaleString('en-IN')} per session
                </p>
              )}
              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className={styles.submitBtn}>{editId ? 'Save Changes' : 'Create Package'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className={styles.overlay} onClick={() => setConfirmDelete(null)}>
          <div className={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
            <p className={styles.confirmText}>Delete package <strong>{confirmDelete.name}</strong> for <strong>{confirmDelete.clientName}</strong>?</p>
            <p className={styles.confirmSub}>This action cannot be undone.</p>
            <div className={styles.confirmActions}>
              <button type="button" className={styles.cancelBtn} onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button type="button" className={styles.deleteConfirmBtn} onClick={() => { deletePackage(confirmDelete.id); setConfirmDelete(null) }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
