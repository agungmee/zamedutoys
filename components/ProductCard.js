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

  const originalPrice = product.original_price;
  const hasDiscount = originalPrice && originalPrice > product.price;
  const discountPercent = hasDiscount ? Math.round(((originalPrice - product.price) / originalPrice) * 100) : 0;

  const isPreorder = product.is_preorder;
  const preorderDays = product.preorder_days || 7;
  const mainMedia = product.images?.[0] || '/placeholder.png';
  const isVideo = typeof mainMedia === 'string' && mainMedia.endsWith('.mp4');

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {hasDiscount && (
          <div className={styles.discountBadge} style={{ top: isPreorder ? '35px' : '8px' }}>
            {discountPercent}% OFF
          </div>
        )}
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
        <div className={styles.priceRow}>
          <p className={styles.price}>{formatRupiah(product.price)}</p>
          {hasDiscount && (
            <p className={styles.originalPrice}>{formatRupiah(originalPrice)}</p>
          )}
        </div>

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
