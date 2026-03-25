// Navbar
import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import styles from "./Navbar.module.css";

const navigation = [
  { name: "Platform", href: "/#platform" },
  { name: "Solutions", href: "/#solutions" },
  { name: "Resources", href: "/#resources" },
  { name: "Products", href: "/#products" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <nav aria-label="Global" className={styles.nav}>
        {/* Logo */}
        <div className={styles.logoWrap}>
          <a href="/" className={styles.logo}>
            App
          </a>
        </div>

        {/* Desktop nav links */}
        <div className={styles.desktopLinks}>
          {navigation.map((item) => (
            <a key={item.name} href={item.href} className={styles.navLink}>
              {item.name}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className={styles.desktopCtas}>
          <a href="/login" className={styles.ctaLogin}>
            Log in
          </a>
          <a href="/signup" className={styles.ctaOutline}>
            Try App for free
          </a>
        </div>

        {/* Hamburger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className={styles.menuBtn}
        >
          {/* Screen reader only */}
          <span className={styles.srOnly}>Open main menu</span>
          <Bars3Icon aria-hidden="true" className={styles.menuIcon} />
        </button>
      </nav>

      {/* Mobile drawer */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        {/* Backdrop */}
        <button
          type="button"
          aria-label="Close menu"
          className={styles.backdrop}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Panel */}
        <DialogPanel className={styles.drawer}>
          <div className={styles.drawerHeader}>
            <a href="/" className={styles.logo}>
              App
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className={styles.closeBtn}
            >
              <span className={styles.srOnly}>Close menu</span>
              <XMarkIcon aria-hidden="true" className={styles.menuIcon} />
            </button>
          </div>

          <div className={styles.drawerBody}>
            {/* Nav links */}
            <div className={styles.drawerLinkGroup}>
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={styles.drawerLink}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* CTAs */}
            <div className={styles.drawerCtaGroup}>
              <a href="/login" className={styles.drawerCtaLogin}>
                Log in
              </a>
              <a href="/signup" className={styles.drawerCtaOutline}>
                Try App for free
              </a>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
