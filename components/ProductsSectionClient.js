"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import styles from './ProductsSection.module.css';

// Adapter: konversi format Supabase → format yang dipakai ProductCard
function adaptProduct(p) {
  return {
    id: p.id,
    title: p.title,
    price: p.price,
    rating: p.rating,
    sold: p.sold,
    media: p.images || [],
    stock: p.stock,
    variants: p.variants || [],
    brand: p.brand,
    category: p.category,
    tags: p.tags || [],
    description: p.description,
    whatsapp_msg: p.whatsapp_msg,
    is_preorder: p.is_preorder || false,
    preorder_days: p.preorder_days || 7,
    product_variants: p.product_variants || [],
    images: p.images || [],
    categories: p.categories,
  };
}

export default function ProductsSectionClient({ title = "Produk Terbaru", products = [], reverse = false }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const scrollRef = useRef(null);
  const adapted = products.map(adaptProduct);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [adapted.length]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth + 100 : scrollLeft + clientWidth - 100;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.heading}>{title}</h2>
        <div className={styles.headerActions}>
          <Link href={`/produk?sort=${reverse ? 'terlaris' : 'terbaru'}`} className={styles.viewAll}>
            Lihat Semua <i className="fa-solid fa-arrow-right"></i>
          </Link>
          <div className={styles.navButtons}>
            <button className={styles.navBtn} onClick={() => scroll('left')} aria-label="Slide Left">
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button className={styles.navBtn} onClick={() => scroll('right')} aria-label="Slide Right">
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      <div className={styles.grid} ref={scrollRef}>
        {adapted.length === 0 ? (
          <div style={{ padding: '2rem', color: 'rgba(0,0,0,0.4)', fontSize: '0.875rem' }}>
            Belum ada produk.
          </div>
        ) : (
          adapted.map(product => (
            <div key={product.id} className={styles.cardWrapper}>
              <ProductCard
                product={product}
                onDetailClick={(prod) => setSelectedProduct(prod)}
              />
            </div>
          ))
        )}
        <div className={styles.viewAllMobileWrapper}>
          <Link href={`/produk?sort=${reverse ? 'terlaris' : 'terbaru'}`} className={styles.viewAllCard}>
            <div className={styles.viewAllIcon}>
              <i className="fa-solid fa-arrow-right"></i>
            </div>
            <span>Lihat Semua</span>
          </Link>
        </div>
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
