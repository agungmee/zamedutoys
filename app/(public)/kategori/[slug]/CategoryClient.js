"use client";
import React, { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import styles from '../Kategori.module.css';
import Link from 'next/link';

export default function CategoryClient({ products = [], categoryName = 'Kategori' }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/kategori" className={styles.backLink}>← Kembali ke Kategori</Link>
          <h1 className={styles.title}>{categoryName}</h1>
          <p className={styles.subtitle}>Koleksi mainan terbaik untuk kategori {categoryName.toLowerCase()}</p>
        </div>

        {products.length > 0 ? (
          <div className={styles.productGrid}>
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onDetailClick={(prod) => setSelectedProduct(prod)} 
              />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>Belum ada produk di kategori ini.</div>
        )}

        {selectedProduct && (
          <ProductModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
          />
        )}
      </div>
    </main>
  );
}
