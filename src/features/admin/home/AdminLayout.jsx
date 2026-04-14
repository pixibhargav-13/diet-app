import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Dialog, DialogPanel } from "@headlessui/react";
import AppSidebar from "../../../app/components/AppSidebar/AppSidebar";
import Topbar from "../../dashboard/components/Topbar";
import styles from "../../dashboard/DashboardLayout.module.css";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.root}>
      <Dialog
        open={sidebarOpen}
        onClose={setSidebarOpen}
        className={styles.mobileDialog}
      >
        <button
          type="button"
          className={styles.backdrop}
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />

        <div className={styles.drawerContainer}>
          <DialogPanel transition className={styles.drawerPanel}>
            <AppSidebar mode="admin" onClose={() => setSidebarOpen(false)} />
          </DialogPanel>
        </div>
      </Dialog>

      <div className={styles.desktopSidebar}>
        <AppSidebar mode="admin" />
      </div>

      <div className={styles.mainCol}>
        <Topbar onMenuOpen={() => setSidebarOpen(true)} />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
