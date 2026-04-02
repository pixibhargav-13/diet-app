// DashboardLayout — static sidebar (desktop) + Dialog drawer (mobile) + topbar
// All dashboard pages render via <Outlet /> for nested routing
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Dialog, DialogPanel, TransitionChild } from "@headlessui/react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import styles from "./DashboardLayout.module.css";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.root}>
      {/* ── Mobile sidebar drawer ── */}
      <Dialog
        open={sidebarOpen}
        onClose={setSidebarOpen}
        className={styles.mobileDialog}
      >
        {/* Backdrop */}
        <button
          type="button"
          className={styles.backdrop}
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />

        <div className={styles.drawerContainer}>
          <DialogPanel transition className={styles.drawerPanel}>
            <TransitionChild>
              {/* Close button floats outside the panel to the right */}
              <div className={styles.closeWrap}>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className={styles.closeBtn}
                  aria-label="Close sidebar"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </TransitionChild>

            <Sidebar onClose={() => setSidebarOpen(false)} />
          </DialogPanel>
        </div>
      </Dialog>

      {/* ── Static desktop sidebar ── */}
      <div className={styles.desktopSidebar}>
        <Sidebar />
      </div>

      {/* ── Main column ── */}
      <div className={styles.mainCol}>
        <Topbar onMenuOpen={() => setSidebarOpen(true)} />

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
