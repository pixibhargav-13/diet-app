// RevenueSnapshot — simple revenue overview widget for admin dashboard
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import AdminPanel from "../AdminPanel/AdminPanel";
import styles from "./RevenueSnapshot.module.css";

export default function RevenueSnapshot({
  data,
  total,
  packages,
  products,
  refunds,
}) {
  const reportLink = (
    <Link to="/admin/revenue" className={styles.viewAllBtn}>
      Full Report →
    </Link>
  );

  return (
    <AdminPanel
      title="Revenue Snapshot"
      right={reportLink}
      icon={
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      }
    >
      {/* Key metrics */}
      <div className={styles.metrics}>
        <div className={styles.metricMain}>
          <span className={styles.metricLabel}>This Month</span>
          <span className={styles.metricTotal}>₹{total.toLocaleString()}</span>
        </div>
        <div className={styles.metricGroup}>
          <div className={styles.metric}>
            <span className={styles.mLabel}>Packages</span>
            <span className={styles.mVal}>₹{packages.toLocaleString()}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.mLabel}>Products</span>
            <span className={styles.mVal}>₹{products.toLocaleString()}</span>
          </div>
          <div className={`${styles.metric} ${styles.metricRefund}`}>
            <span className={styles.mLabel}>Refunds</span>
            <span className={styles.mValRefund}>
              -₹{refunds.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Trend sparkline */}
      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={72}>
          <LineChart
            data={data}
            margin={{ top: 4, right: 4, left: 4, bottom: 0 }}
          >
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(v) => [`₹${v.toLocaleString()}`, "Revenue"]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#2a4365"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#2a4365" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </AdminPanel>
  );
}

RevenueSnapshot.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, value: PropTypes.number }),
  ).isRequired,
  total: PropTypes.number.isRequired,
  packages: PropTypes.number.isRequired,
  products: PropTypes.number.isRequired,
  refunds: PropTypes.number.isRequired,
};
