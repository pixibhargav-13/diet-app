import { useState } from 'react'
import { TRANSACTIONS } from '../data/adminMockData'
import styles from './RevenuePayments.module.css'

const MONTHLY = [
  { month: 'Nov', packages: 38500, products: 8200 },
  { month: 'Dec', packages: 44000, products: 11400 },
  { month: 'Jan', packages: 49500, products: 13200 },
  { month: 'Feb', packages: 55000, products: 14800 },
  { month: 'Mar', packages: 60500, products: 16900 },
  { month: 'Apr', packages: 66000, products: 18500 },
]

function formatINR(val) {
  return '₹' + val.toLocaleString('en-IN')
}

export default function RevenuePayments() {
  const [statusFilter, setStatusFilter] = useState('All')
  const [exportDone, setExportDone] = useState(false)
  const [gstDone, setGstDone] = useState(false)

  const filtered = statusFilter === 'All'
    ? TRANSACTIONS
    : TRANSACTIONS.filter((t) => t.status === statusFilter)

  const totalRevenue = TRANSACTIONS.filter((t) => t.status === 'Success').reduce((s, t) => s + t.amount, 0)
  const totalPending  = TRANSACTIONS.filter((t) => t.status === 'Pending').reduce((s, t) => s + t.amount, 0)
  const totalRefunded = TRANSACTIONS.filter((t) => t.status === 'Refunded').reduce((s, t) => s + t.amount, 0)

  const maxBar = Math.max(...MONTHLY.map((m) => m.packages + m.products))

  const handleExport = () => {
    const csv = [
      'ID,Client,Type,Amount,Status,Date,Method',
      ...TRANSACTIONS.map((t) => `${t.id},${t.client},${t.type},${t.amount},${t.status},${t.date},${t.method}`),
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'payments.csv'; a.click()
    URL.revokeObjectURL(url)
    setExportDone(true); setTimeout(() => setExportDone(false), 2000)
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.heading}>Revenue &amp; Payments</h1>
          <p className={styles.sub}>Track all transactions, generate invoices and export statements.</p>
        </div>
        <div className={styles.headerActions}>
          <button type="button" className={styles.actionBtn} onClick={() => { setGstDone(true); setTimeout(() => setGstDone(false), 2000) }}>
            {gstDone ? '✓ Generated' : 'GST Invoice'}
          </button>
          <button type="button" className={styles.primaryBtn} onClick={handleExport}>
            {exportDone ? '✓ Exported' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* Revenue stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Total Revenue (This Month)</p>
          <p className={`${styles.statValue} ${styles.green}`}>{formatINR(totalRevenue)}</p>
          <p className={styles.statSub}>from {TRANSACTIONS.filter((t) => t.status === 'Success').length} transactions</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Pending Payments</p>
          <p className={`${styles.statValue} ${styles.warn}`}>{formatINR(totalPending)}</p>
          <p className={styles.statSub}>{TRANSACTIONS.filter((t) => t.status === 'Pending').length} awaiting</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Refunded</p>
          <p className={`${styles.statValue} ${styles.red}`}>{formatINR(totalRefunded)}</p>
          <p className={styles.statSub}>{TRANSACTIONS.filter((t) => t.status === 'Refunded').length} refunds</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Package vs Product Split</p>
          <p className={`${styles.statValue} ${styles.blue}`}>73% / 27%</p>
          <p className={styles.statSub}>packages vs products</p>
        </div>
      </div>

      {/* Revenue chart */}
      <div className={styles.chartCard}>
        <p className={styles.chartTitle}>Monthly Revenue — Packages vs Products</p>
        <div className={styles.chart}>
          {MONTHLY.map((m) => {
            const pkgH = Math.round((m.packages / maxBar) * 100)
            const prdH = Math.round((m.products / maxBar) * 100)
            return (
              <div key={m.month} className={styles.chartCol}>
                <div className={styles.barGroup}>
                  <div className={styles.barWrap} title={`Packages: ${formatINR(m.packages)}`}>
                    <div className={`${styles.bar} ${styles.barBlue}`} style={{ height: `${pkgH}%` }} />
                  </div>
                  <div className={styles.barWrap} title={`Products: ${formatINR(m.products)}`}>
                    <div className={`${styles.bar} ${styles.barGreen}`} style={{ height: `${prdH}%` }} />
                  </div>
                </div>
                <span className={styles.chartMonth}>{m.month}</span>
              </div>
            )
          })}
        </div>
        <div className={styles.legend}>
          <span className={styles.legendItem}><span className={`${styles.dot} ${styles.dotBlue}`} />Packages</span>
          <span className={styles.legendItem}><span className={`${styles.dot} ${styles.dotGreen}`} />Products</span>
        </div>
      </div>

      {/* Transactions table */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <p className={styles.cardTitle}>All Transactions</p>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={styles.select}>
            {['All', 'Success', 'Pending', 'Refunded'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Client</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td className={styles.txnId}>{t.id}</td>
                  <td className={styles.clientCell}>{t.client}</td>
                  <td><span className={`${styles.typeChip} ${t.type === 'Package' ? styles.typePackage : styles.typeProduct}`}>{t.type}</span></td>
                  <td className={styles.amount}>{formatINR(t.amount)}</td>
                  <td className={styles.methodCell}>{t.method}</td>
                  <td className={styles.dateCell}>{t.date}</td>
                  <td><span className={`${styles.statusBadge} ${styles['s' + t.status]}`}>{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
