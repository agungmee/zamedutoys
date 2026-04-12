"use client";
import React, { useState, useEffect, use } from 'react';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import styles from '../Kategori.module.css';
import Link from 'next/link';

export default function CategoryDetailPage({ params }) {
  const { slug } = use(params);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const categoryMap = {
    'motorik-kasar': 'Motorik Kasar',
    'sensori': 'Sensori',
    'furniture-anak': 'Furniture Anak'
  };

  const categoryName = categoryMap[slug] || 'Kategori';

  useEffect(() => {
    fetch('/product/data.json')
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(p => p.category === categoryName);
        setProducts(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading category products:", err);
        setLoading(false);
      });
  }, [categoryName]);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/kategori" className={styles.backLink}>← Kembali ke Kategori</Link>
          <h1 className={styles.title}>{categoryName}</h1>
          <p className={styles.subtitle}>Koleksi mainan terbaik untuk kategori {categoryName.toLowerCase()}</p>
        </div>

        {loading ? (
          <div className={styles.loading}>Memuat produk...</div>
        ) : products.length > 0 ? (
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
