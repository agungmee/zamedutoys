"use client";
import React from 'react';
import Link from 'next/link';
import styles from './CategoryIcons.module.css';

const ICON_MAP = {
  'Helper Tower': (
    <svg className={styles.svgIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M6 3v18M18 3v18M6 10h12M6 15h12M10 3l-2 2M14 3l2 2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  'Pretend Play': (
    <svg className={styles.svgIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 22V12h6v10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  'Brakiasi dan Prikler': (
    <svg className={styles.svgIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M3 21l9-18 9 18M3 21h18M7 13h10M9 9h6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  'Balance Beam': (
    <svg className={styles.svgIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M2 17h20M5 17v3M19 17v3M12 17v3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 14h16l-2-5H6l-2 5z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  'Open Endded Toys': (
    <svg className={styles.svgIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M12 3v3M18.66 4.89l-2.12 2.12M21 12h-3M18.66 19.11l-2.12-2.12M12 21v-3M5.34 19.11l2.12-2.12M3 12h3M5.34 4.89l2.12 2.12" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  'Balance Board': (
    <svg className={styles.svgIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M3 12c0 4.97 4.03 9 9 9s9-4.03 9-9" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 11h16" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  'Lainnya': (
    <svg className={styles.svgIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="1" fill="currentColor"/>
      <circle cx="19" cy="12" r="1" fill="currentColor"/>
      <circle cx="5" cy="12" r="1" fill="currentColor"/>
    </svg>
  )
};

const DEFAULT_ICON = (
  <svg className={styles.svgIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M21 8l-2-2H5L3 8v10h18V8zM3 8l9 6 9-6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function CategoryIcons({ categories = [] }) {
  // Sort categories: put "Lainnya" at the end
  const sortedCategories = [...categories].sort((a, b) => {
    if (a.name.toLowerCase() === 'lainnya') return 1;
    if (b.name.toLowerCase() === 'lainnya') return -1;
    return a.name.localeCompare(b.name);
  });

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Kategori</h2>
      </div>

      <div className={styles.grid}>
        {sortedCategories.map((cat) => (
          <Link key={cat.id} href={`/produk?category=${encodeURIComponent(cat.name)}`} className={styles.card}>
            <div className={styles.iconWrapper}>
              {ICON_MAP[cat.name] || DEFAULT_ICON}
            </div>
            <span className={styles.label}>{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
