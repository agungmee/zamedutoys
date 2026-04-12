import React from 'react';
import Link from 'next/link';
import styles from './Kategori.module.css';

const categories = [
  { 
    name: 'Motorik Kasar', 
    slug: 'motorik-kasar', 
    icon: '🏃', 
    count: '2 Produk',
    desc: 'Melatih fisik dan koordinasi anak',
    bg: '#fff5f5'
  },
  { 
    name: 'Sensori', 
    slug: 'sensori', 
    icon: '🧩', 
    count: '1 Produk',
    desc: 'Menstimulasi panca indera si kecil',
    bg: '#f0f9ff'
  },
  { 
    name: 'Furniture Anak', 
    slug: 'furniture-anak', 
    icon: '🪑', 
    count: '1 Produk',
    desc: 'Perlengkapan untuk kemandirian anak',
    bg: '#f0fff4'
  }
];

export default function KategoriPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Kategori Produk</h1>
          <p className={styles.subtitle}>Temukan mainan edukasi yang tepat berdasarkan kebutuhan tumbuh kembang si kecil</p>
        </div>

        <div className={styles.grid}>
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/kategori/${cat.slug}`} className={styles.card}>
              <div className={styles.iconWrapper} style={{ backgroundColor: cat.bg }}>
                <span className={styles.icon}>{cat.icon}</span>
              </div>
              <div className={styles.content}>
                <h2 className={styles.catName}>{cat.name}</h2>
                <p className={styles.catDesc}>{cat.desc}</p>
                <span className={styles.count}>{cat.count}</span>
              </div>
              <div className={styles.arrow}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7 5L12 10L7 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
