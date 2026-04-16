"use client";
import React, { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import styles from './Produk.module.css';

export default function ProdukClient({ products = [], sortParam = 'terbaru', categoryParam }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const title = categoryParam 
    ? `Koleksi ${categoryParam}` 
    : (sortParam === 'terbaru' ? 'Produk Terbaru' : 'Produk Terlaris');

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          {categoryParam && (
            <a href="/produk" className={styles.backLink} style={{ display: 'block', marginBottom: '1rem', color: '#666', textDecoration: 'none' }}>
              ← Lihat Semua Produk
            </a>
          )}
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>
            {categoryParam 
              ? `Menampilkan produk terbaik untuk kategori ${categoryParam.toLowerCase()}.`
              : 'Jelajahi koleksi mainan edukasi premium terbaik untuk buah hati Anda.'}
          </p>
        </header>

        {products.length > 0 ? (
          <div className={styles.grid}>
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onDetailClick={(prod) => setSelectedProduct(prod)} 
              />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>Produk tidak ditemukan.</div>
        )}
      </div>

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </main>
  );
}
