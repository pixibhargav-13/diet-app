// Topbar — hamburger (mobile), search, notifications, user greeting
import PropTypes from 'prop-types'
import { useAuthStore } from '../../../store/useAuthStore'
import styles from './Topbar.module.css'

export default function Topbar({ onMenuOpen }) {
  const { user } = useAuthStore()

  return (
    <header className={styles.topbar}>
      <div className={styles.inner}>
        {/* Hamburger — mobile only */}
        <button
          type="button"
          onClick={onMenuOpen}
          className={styles.menuBtn}
          aria-label="Open sidebar"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Divider — mobile only */}
        <div className={styles.mobileDivider} aria-hidden="true" />

        {/* Search */}
        <div className={styles.searchWrap}>
          <div className={styles.searchInner}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.searchIcon}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              placeholder="Search insights…"
              aria-label="Search"
              className={styles.searchInput}
            />
          </div>
        </div>

        {/* Right side */}
        <div className={styles.right}>
          {/* Notifications */}
          <button type="button" className={styles.iconBtn} aria-label="View notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>

          {/* Divider */}
          <div className={styles.divider} aria-hidden="true" />

          {/* User greeting */}
          <div className={styles.userGreeting}>
            <div className={styles.avatar}>
              {user?.firstName?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <span className={styles.greeting}>
              {user?.firstName ? `Hi, ${user.firstName}` : 'Welcome'}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

Topbar.propTypes = {
  onMenuOpen: PropTypes.func.isRequired,
}