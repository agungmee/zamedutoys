'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImportExcelModal from './ImportExcelModal';
import styles from './produk.module.css';

export default function ProductHeader({ productCount }) {
  const router = useRouter();
  const [showImport, setShowImport] = useState(false);

  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>Produk</h1>
        <p className={styles.subtitle}>{productCount} produk terdaftar</p>
      </div>
      <div className={styles.headerActions}>
        <button 
          onClick={() => setShowImport(true)} 
          className={styles.importBtn}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
          Import Excel
        </button>
        <a href="/admin/produk/tambah" className={styles.addBtn}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Tambah Produk
        </a>
      </div>

      {showImport && (
        <ImportExcelModal 
          onClose={() => setShowImport(false)} 
          onSuccess={() => router.refresh()} 
        />
      )}
    </div>
  );
}
