"use client";
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import styles from './ProductsSection.module.css';

export default function ProductsSection({ title = "Produk Terbaru", reverse = false }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>{title}</h2>
      <div className={styles.grid}>
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onDetailClick={(prod) => setSelectedProduct(prod)} 
          />
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
