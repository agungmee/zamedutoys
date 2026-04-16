"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import NavbarSearch from './NavbarSearch';
import styles from './Navbar.module.css';

const navItems = [
  { href: '/',             label: 'Home',         icon: '🏠',  desc: 'Kembali ke Beranda' },
  { href: '/cara-pesan',   label: 'Cara Pesan',   icon: '📝',  desc: 'Panduan pemesanan produk' },
  { href: '/garansi',      label: 'Garansi',      icon: '🛡️',  desc: 'Info garansi & layanan' },
  { href: '/grosir',       label: 'Beli Grosir',  icon: '📦',  desc: 'Harga spesial untuk reseller', highlight: true },
];

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const close = () => setMobileMenuOpen(false);

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.container}>
          <Link href="/" className={styles.brand} onClick={close}>
            <div className={styles.logoWrapper}>
              <Image
                src="/logo.png"
                alt="ZAM EDUTOYS Logo"
                width={200}
                height={60}
                priority
                className={styles.logoImage}
              />
            </div>
          </Link>

          {/* Search Bar Desktop & Mobile */}
          <div className={styles.searchNavContainer}>
            <NavbarSearch />
          </div>

          {/* Desktop links */}
          <div className={styles.navLinks}>
            {navItems.map((item) =>
              item.highlight ? (
                <Link key={item.href} href={item.href} className={styles.button}>
                  {item.label}
                </Link>
              ) : (
                <Link key={item.href} href={item.href} className={styles.link}>
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* Hamburger */}
          <button
            className={`${styles.mobileToggle} ${mobileMenuOpen ? styles.open : ''}`}
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle Navigation"
          >
            <span className={styles.hamburger}></span>
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      <div
        className={`${styles.overlay} ${mobileMenuOpen ? styles.overlayOpen : ''}`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <aside className={`${styles.drawer} ${mobileMenuOpen ? styles.drawerOpen : ''}`}>
        {/* Drawer Header */}
        <div className={styles.drawerHeader}>
          <Image src="/logo.png" alt="ZAM EDUTOYS" width={120} height={36} className={styles.drawerLogo} />
          <button className={styles.closeBtn} onClick={close} aria-label="Tutup menu">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Nav Items */}
        <nav className={styles.drawerNav}>
          {navItems.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.drawerItem} ${item.highlight ? styles.drawerItemHighlight : ''}`}
              onClick={close}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className={styles.drawerIcon}>{item.icon}</span>
              <span className={styles.drawerText}>
                <span className={styles.drawerLabel}>{item.label}</span>
                <span className={styles.drawerDesc}>{item.desc}</span>
              </span>
              <svg className={styles.drawerArrow} width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          ))}
        </nav>

        {/* Drawer Footer */}
        <div className={styles.drawerFooter}>
          <p className={styles.drawerFooterText}>🔒 Belanja aman &amp; terpercaya</p>
          <p className={styles.drawerFooterSub}>© 2025 ZAM EDUTOYS</p>
        </div>
      </aside>
    </>
  );
}
