import { useState } from 'react'
import { useYogaSessionStore } from '../../../store/useYogaSessionStore'
import { CLIENTS } from '../data/adminMockData'
import styles from './PolicySettings.module.css'

export default function PolicySettings() {
  const { policy, updatePolicy, updateClientPolicy, clearClientPolicy } = useYogaSessionStore()

  const [globalForm, setGlobalForm] = useState({
    cancellationNoticeHours: policy.cancellationNoticeHours,
    maxReschedulePerMonth: policy.maxReschedulePerMonth,
  })
  const [globalSaved, setGlobalSaved] = useState(false)

  const [overrideModal, setOverrideModal] = useState(null) // client object
  const [overrideForm, setOverrideForm] = useState({ cancellationNoticeHours: '', maxReschedulePerMonth: '' })

  const handleGlobalSave = (e) => {
    e.preventDefault()
    updatePolicy({
      cancellationNoticeHours: Number(globalForm.cancellationNoticeHours),
      maxReschedulePerMonth: Number(globalForm.maxReschedulePerMonth),
    })
    setGlobalSaved(true)
    setTimeout(() => setGlobalSaved(false), 2500)
  }

  const openOverride = (client) => {
    const existing = policy.clientOverrides[client.id] ?? {}
    setOverrideForm({
      cancellationNoticeHours: existing.cancellationNoticeHours ?? '',
      maxReschedulePerMonth: existing.maxReschedulePerMonth ?? '',
    })
    setOverrideModal(client)
  }

  const handleOverrideSave = (e) => {
    e.preventDefault()
    const changes = {}
    if (overrideForm.cancellationNoticeHours !== '') changes.cancellationNoticeHours = Number(overrideForm.cancellationNoticeHours)
    if (overrideForm.maxReschedulePerMonth !== '') changes.maxReschedulePerMonth = Number(overrideForm.maxReschedulePerMonth)
    if (Object.keys(changes).length > 0) updateClientPolicy(overrideModal.id, changes)
    setOverrideModal(null)
  }

  const clientsWithOverrides = CLIENTS.filter((c) => policy.clientOverrides[c.id])
  const clientsWithout = CLIENTS.filter((c) => !policy.clientOverrides[c.id])

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.heading}>Policy Settings</h1>
          <p className={styles.sub}>Configure cancellation notice periods, reschedule limits and per-client overrides.</p>
        </div>
      </div>

      {/* Global defaults */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93A10 10 0 0 0 4.93 19.07M19.07 4.93A10 10 0 1 1 4.93 19.07"/>
            </svg>
          </div>
          <div>
            <p className={styles.cardTitle}>Global Defaults</p>
            <p className={styles.cardSub}>These apply to all clients unless overridden individually.</p>
          </div>
        </div>
        <form onSubmit={handleGlobalSave} className={styles.policyForm}>
          <div className={styles.policyGrid}>
            <div className={styles.policyField}>
              <label className={styles.fieldLabel}>Minimum Cancellation Notice</label>
              <p className={styles.fieldDesc}>Minimum hours required before a session can be rescheduled or cancelled without penalty.</p>
              <div className={styles.inputWithUnit}>
                <input
                  type="number" min="0" max="168" className={styles.numberInput}
                  value={globalForm.cancellationNoticeHours}
                  onChange={(e) => setGlobalForm((f) => ({ ...f, cancellationNoticeHours: e.target.value }))}
                />
                <span className={styles.unit}>hours</span>
              </div>
            </div>
            <div className={styles.policyField}>
              <label className={styles.fieldLabel}>Max Reschedules per Month</label>
              <p className={styles.fieldDesc}>Maximum number of times a client can reschedule sessions within a calendar month.</p>
              <div className={styles.inputWithUnit}>
                <input
                  type="number" min="0" max="10" className={styles.numberInput}
                  value={globalForm.maxReschedulePerMonth}
                  onChange={(e) => setGlobalForm((f) => ({ ...f, maxReschedulePerMonth: e.target.value }))}
                />
                <span className={styles.unit}>reschedules</span>
              </div>
            </div>
          </div>
          <div className={styles.saveRow}>
            <button type="submit" className={styles.saveBtn}>
              {globalSaved ? '✓ Saved!' : 'Save Global Defaults'}
            </button>
          </div>
        </form>
      </div>

      {/* How it works */}
      <div className={styles.infoCard}>
        <p className={styles.infoTitle}>How policies work</p>
        <ul className={styles.infoList}>
          <li>If a client has no individual override, the global defaults apply.</li>
          <li>Per-client overrides take full precedence over global defaults.</li>
          <li>Reschedule limits reset at the start of each calendar month.</li>
          <li>Late cancellation (within notice period) is recorded but not automatically blocked — the admin sees a warning.</li>
        </ul>
      </div>

      {/* Per-client overrides */}
      <div className={styles.card}>
        <div className={styles.overrideHeader}>
          <p className={styles.cardTitle}>Per-Client Overrides</p>
          <p className={styles.cardSub}>{clientsWithOverrides.length} client{clientsWithOverrides.length !== 1 ? 's' : ''} with custom policies</p>
        </div>

        {/* Clients WITH overrides */}
        {clientsWithOverrides.length > 0 && (
          <div className={styles.overrideTable}>
            <div className={styles.tableHeader}>
              <span>Client</span>
              <span>Notice Period</span>
              <span>Max Reschedules</span>
              <span>Actions</span>
            </div>
            {clientsWithOverrides.map((client) => {
              const ov = policy.clientOverrides[client.id]
              return (
                <div key={client.id} className={styles.tableRow}>
                  <div className={styles.clientCell}>
                    <div className={styles.clientAvatar}>{client.name[0]}</div>
                    <span className={styles.clientName}>{client.name}</span>
                  </div>
                  <div className={styles.overrideCell}>
                    {ov.cancellationNoticeHours !== undefined
                      ? <span className={styles.overrideValue}>{ov.cancellationNoticeHours}h</span>
                      : <span className={styles.inheritValue}>— (global: {policy.cancellationNoticeHours}h)</span>
                    }
                  </div>
                  <div className={styles.overrideCell}>
                    {ov.maxReschedulePerMonth !== undefined
                      ? <span className={styles.overrideValue}>{ov.maxReschedulePerMonth}/month</span>
                      : <span className={styles.inheritValue}>— (global: {policy.maxReschedulePerMonth}/month)</span>
                    }
                  </div>
                  <div className={styles.actionCell}>
                    <button type="button" className={styles.editOverrideBtn} onClick={() => openOverride(client)}>Edit</button>
                    <button type="button" className={styles.clearOverrideBtn} onClick={() => clearClientPolicy(client.id)}>Clear</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Clients WITHOUT overrides - show as a compact list to add */}
        <div className={styles.noOverrideSection}>
          <p className={styles.noOverrideTitle}>Add override for a client</p>
          <div className={styles.clientChips}>
            {clientsWithout.map((client) => (
              <button key={client.id} type="button" className={styles.clientChip} onClick={() => openOverride(client)}>
                <span className={styles.chipAvatar}>{client.name[0]}</span>
                {client.name}
                <span className={styles.chipAdd}>+</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Override modal */}
      {overrideModal && (
        <div className={styles.overlay} onClick={() => setOverrideModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <p className={styles.modalTitle}>Policy Override — {overrideModal.name}</p>
              <button type="button" className={styles.modalClose} onClick={() => setOverrideModal(null)}>✕</button>
            </div>
            <form onSubmit={handleOverrideSave} className={styles.modalBody}>
              <p className={styles.overrideNote}>
                Leave a field empty to inherit the global default. Fill it in to set a custom value for this client only.
              </p>
              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Notice Period (hours)</label>
                  <p className={styles.labelSub}>Global default: {policy.cancellationNoticeHours}h</p>
                  <input
                    type="number" min="0" max="168" className={styles.input}
                    value={overrideForm.cancellationNoticeHours}
                    onChange={(e) => setOverrideForm((f) => ({ ...f, cancellationNoticeHours: e.target.value }))}
                    placeholder={`Default: ${policy.cancellationNoticeHours}h`}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Max Reschedules/Month</label>
                  <p className={styles.labelSub}>Global default: {policy.maxReschedulePerMonth}</p>
                  <input
                    type="number" min="0" max="10" className={styles.input}
                    value={overrideForm.maxReschedulePerMonth}
                    onChange={(e) => setOverrideForm((f) => ({ ...f, maxReschedulePerMonth: e.target.value }))}
                    placeholder={`Default: ${policy.maxReschedulePerMonth}`}
                  />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setOverrideModal(null)}>Cancel</button>
                <button type="submit" className={styles.submitBtn}>Save Override</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
