"use client";
import React, { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import styles from './ProductsSection.module.css';

export default function ProductsSection({ title = "Produk Terbaru", reverse = false }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetch('/product/data.json')
      .then(res => res.json())
      .then(data => {
        if (reverse) {
          setProducts(data.reverse());
        } else {
          setProducts(data);
        }
      })
      .catch(err => console.error("Error loading products:", err));
  }, [reverse]);

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
        <div className={styles.navButtons}>
          <button className={styles.navBtn} onClick={() => scroll('left')} aria-label="Slide Left">
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button className={styles.navBtn} onClick={() => scroll('right')} aria-label="Slide Right">
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <div className={styles.grid} ref={scrollRef}>
        {products.map(product => (
          <div key={product.id} className={styles.cardWrapper}>
            <ProductCard 
              product={product} 
              onDetailClick={(prod) => setSelectedProduct(prod)} 
            />
          </div>
        ))}
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
