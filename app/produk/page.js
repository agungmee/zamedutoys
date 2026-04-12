"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import styles from './Produk.module.css';

function ProdukContent() {
  const searchParams = useSearchParams();
  const sortParam = searchParams.get('sort') || 'terbaru';
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/product/data.json')
      .then(res => res.json())
      .then(data => {
        let sortedData = [...data];
        if (sortParam === 'terbaru') {
          sortedData.reverse();
        }
        // Jika terlaris, gunakan urutan default atau logika lain
        setProducts(sortedData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading products:", err);
        setLoading(false);
      });
  }, [sortParam]);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            {sortParam === 'terbaru' ? 'Produk Terbaru' : 'Produk Terlaris'}
          </h1>
          <p className={styles.subtitle}>
            Jelajahi koleksi mainan edukasi premium terbaik untuk buah hati Anda.
          </p>
        </header>

        {loading ? (
          <div className={styles.loading}>Memuat produk...</div>
        ) : products.length > 0 ? (
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

export default function ProdukPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProdukContent />
    </Suspense>
  );
}
