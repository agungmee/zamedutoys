"use client";
import React from 'react';
import Image from 'next/image';
import styles from './ProductCard.module.css';

export default function ProductCard({ product, onDetailClick }) {
  // Utility for IDR formatting
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  const mainMedia = product.media ? product.media[0] : (product.images && product.images[0]) || '/placeholder.png';
  const isVideo = mainMedia && mainMedia.endsWith('.mp4');
  const isPreorder = product.is_preorder || false;
  const preorderDays = product.preorder_days || 7;

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {isPreorder && (
          <div className={styles.preorderBadge}>PO ({preorderDays} hari)</div>
        )}
        {isVideo ? (
          <video src={mainMedia} className={styles.image} autoPlay muted loop playsInline />
        ) : (
          <Image src={mainMedia} alt={product.title} fill className={styles.image} />
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.price}>{formatRupiah(product.price)}</p>

        <div className={styles.stats}>
          <span className={styles.rating}>⭐ {product.rating}</span>
          <span className={styles.sold}>1rb+ terjual</span>
        </div>

        <div className={styles.actions}>
          <button className={styles.btnDetail} onClick={() => onDetailClick(product)}>Detail</button>
        </div>
      </div>
    </div>
  );
}
