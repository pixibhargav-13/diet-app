import { useState } from 'react'
import { ORDERS } from '../data/adminMockData'
import styles from './StoreInventory.module.css'

const STATUS_OPTIONS = ['Processing', 'Shipped', 'Delivered', 'Cancelled']

const PRODUCTS = [
  { id: 'p1', name: 'Green Detox Smoothie',   sku: 'GDS-001', price: 19.99, stock: 42, category: 'Smoothies' },
  { id: 'p2', name: 'Immunity Health Shot',    sku: 'IHS-002', price:  9.99, stock: 85, category: 'Health Shots' },
  { id: 'p3', name: 'Whey Protein Combo',      sku: 'WPC-003', price: 54.99, stock: 18, category: 'Combo Packs' },
  { id: 'p4', name: 'Omega 3 + Vitamin D',     sku: 'OVD-004', price: 44.50, stock: 30, category: 'Supplements' },
  { id: 'p5', name: 'Mass Gainer Protein',     sku: 'MGP-005', price: 62.00, stock: 12, category: 'Supplements' },
  { id: 'p6', name: 'Collagen Peptides',       sku: 'CLP-006', price: 34.99, stock: 25, category: 'Supplements' },
  { id: 'p7', name: 'Fiber Plus',              sku: 'FBP-007', price: 14.99, stock: 60, category: 'Health Shots' },
  { id: 'p8', name: 'Probiotic Complex',       sku: 'PBC-008', price: 22.99, stock: 35, category: 'Supplements' },
]

export default function StoreInventory() {
  const [orders, setOrders] = useState(ORDERS)
  const [tab, setTab] = useState('orders')
  const [statusFilter, setStatusFilter] = useState('All')
  const [updatedOrder, setUpdatedOrder] = useState(null)
  const [importSuccess, setImportSuccess] = useState(false)

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o))
    setUpdatedOrder(orderId)
    setTimeout(() => setUpdatedOrder(null), 1500)
  }

  const filtered = statusFilter === 'All' ? orders : orders.filter((o) => o.status === statusFilter)

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.heading}>Store &amp; Inventory</h1>
          <p className={styles.sub}>Manage orders, update inventory and import products.</p>
        </div>
        <div className={styles.headerActions}>
          <button type="button" className={styles.importBtn} onClick={() => { setImportSuccess(true); setTimeout(() => setImportSuccess(false), 2000) }}>
            {importSuccess ? '✓ Imported' : 'Bulk Import CSV'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        {[
          { label: 'Total Orders',    value: orders.length },
          { label: 'Processing',      value: orders.filter((o) => o.status === 'Processing').length, color: 'warn' },
          { label: 'Shipped',         value: orders.filter((o) => o.status === 'Shipped').length,    color: 'blue' },
          { label: 'Delivered',       value: orders.filter((o) => o.status === 'Delivered').length,  color: 'green' },
        ].map((s) => (
          <div key={s.label} className={`${styles.statCard} ${s.color ? styles[s.color] : ''}`}>
            <p className={styles.statVal}>{s.value}</p>
            <p className={styles.statLabel}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button type="button" className={`${styles.tabBtn} ${tab === 'orders' ? styles.tabBtnActive : ''}`} onClick={() => setTab('orders')}>Orders</button>
        <button type="button" className={`${styles.tabBtn} ${tab === 'products' ? styles.tabBtnActive : ''}`} onClick={() => setTab('products')}>Products</button>
      </div>

      {tab === 'orders' && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <p className={styles.cardTitle}>Order Management</p>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={styles.select}>
              <option value="All">All Statuses</option>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Client</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id} className={updatedOrder === o.id ? styles.rowHighlight : ''}>
                    <td className={styles.orderId}>{o.id}</td>
                    <td className={styles.clientCell}>{o.client}</td>
                    <td className={styles.itemsCell}>{o.items}</td>
                    <td className={styles.amount}>${o.amount.toFixed(2)}</td>
                    <td><span className={styles.paymentBadge}>{o.payment}</span></td>
                    <td className={styles.dateCell}>{o.date}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles['s' + o.status.replace(' ', '')]}`}>{o.status}</span>
                    </td>
                    <td>
                      <div className={styles.actionGroup}>
                        <select
                          className={styles.statusSelect}
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        >
                          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button type="button" className={styles.invoiceBtn}>Invoice</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'products' && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <p className={styles.cardTitle}>Product Inventory</p>
            <button type="button" className={styles.addProductBtn}>+ Add Product</button>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {PRODUCTS.map((p) => (
                  <tr key={p.id}>
                    <td className={styles.clientCell}>{p.name}</td>
                    <td className={styles.skuCell}>{p.sku}</td>
                    <td><span className={styles.categoryChip}>{p.category}</span></td>
                    <td className={styles.amount}>${p.price.toFixed(2)}</td>
                    <td>
                      <span className={`${styles.stockBadge} ${p.stock <= 15 ? styles.stockLow : styles.stockOk}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionGroup}>
                        <button type="button" className={styles.invoiceBtn}>Edit</button>
                        <button type="button" className={styles.invoiceBtn} style={{ color: '#dc2626' }}>Remove</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
