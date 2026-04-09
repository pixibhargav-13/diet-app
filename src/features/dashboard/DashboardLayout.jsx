// DashboardLayout — static sidebar (desktop) + Dialog drawer (mobile) + topbar
// All dashboard pages render via <Outlet /> for nested routing
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Dialog, DialogPanel } from "@headlessui/react";
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
