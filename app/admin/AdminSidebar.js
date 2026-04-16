'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { logout } from '@/app/actions/auth';
import styles from './AdminSidebar.module.css';

const navItems = [
  {
    href: '/admin',
    label: 'Dashboard',
    exact: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    href: '/admin/produk',
    label: 'Produk',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 2L3 6v14c0 1.1.9 2 2 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M16 10a4 4 0 11-8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: '/admin/kategori',
    label: 'Kategori',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 7h10v10H7z" stroke="currentColor" strokeWidth="2"/>
        <path d="M7 11h10M7 15h10" stroke="currentColor" strokeWidth="2"/>
        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2v11z" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    href: '/admin/banner',
    label: 'Banner',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M3 13l4-4 5 5 5-5 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8" cy="8" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: '/admin/voucher',
    label: 'Voucher',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 5l-1 0c-1.1 0-2 .9-2 2s.9 2 2 2l1 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M9 5l1 0c1.1 0 2 .9 2 2s-.9 2-2 2l-1 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M12 11v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M15 13h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function AdminSidebar({ userEmail }) {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.brandPill}>
          <div className={styles.logoText}>
            <span className={styles.zam}>ZAM</span>
            <span className={styles.edutoys}>Edutoys</span>
          </div>
          <span className={styles.adminTitle}>Admin</span>
        </div>
      </div>

      <nav className={styles.nav}>
        <span className={styles.navSection}>Menu</span>
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className={styles.userArea}>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            {userEmail?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className={styles.userDetails}>
            <span className={styles.userEmail}>{userEmail}</span>
            <span className={styles.userRole}>Administrator</span>
          </div>
        </div>
        <form action={logout}>
          <button id="admin-logout-btn" type="submit" className={styles.logoutBtn} title="Logout">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </form>
      </div>
    </aside>
  );
}
