import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Kategori.module.css';
import { getCategories } from '@/app/actions/category';

export const metadata = {
  title: 'Kategori Produk',
  description: 'Pilih kategori mainan edukasi sesuai dengan usia dan kebutuhan fase tumbuh kembang anak Anda.',
  openGraph: {
    title: 'Kategori Produk | ZAM Edutoys',
    description: 'Temukan berbagai jenis mainan untuk merangsang berbagai rentang stimulasi dari motorik hingga fungsi kognitif.',
  }
};

export default async function KategoriPage() {
  let categories = await getCategories();

  // Pindahkan kategori "Lainnya" ke urutan paling akhir
  categories = categories.sort((a, b) => {
    if (a.name.toLowerCase() === 'lainnya') return 1;
    if (b.name.toLowerCase() === 'lainnya') return -1;
    return 0;
  });

  // Grid baris isi 3 -> diatur lewat CSS. Kita hanya ganti render HTML-nya.
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
              {cat.image_url ? (
                <div className={styles.imageThumbnail}>
                  <img src={cat.image_url} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ) : (
                <div className={styles.iconWrapper} style={{ backgroundColor: '#f0f9ff' }}>
                  <span className={styles.icon}>🏷️</span>
                </div>
              )}
              <div className={styles.content}>
                <h2 className={styles.catName}>{cat.name}</h2>
                <p className={styles.catDesc}>{cat.description || 'Kategori produk ZAM Edutoys'}</p>
              </div>
              <div className={styles.arrow}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7 5L12 10L7 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>
          ))}
          {categories.length === 0 && (
             <div style={{ padding: '2rem', textAlign: 'center', width: '100%', color: '#666' }}>
               Belum ada kategori.
             </div>
          )}
        </div>
      </div>
    </main>
  );
}
