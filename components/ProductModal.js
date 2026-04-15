"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './ProductModal.module.css';

export default function ProductModal({ product, onClose }) {
  // Ambil varian default atau varian pertama
  const initialVariant = product.product_variants?.find(v => v.is_default) || product.product_variants?.[0] || { name: 'Default', price: product.price };

  const [activeVariant, setActiveVariant] = useState(initialVariant);
  const [activeMedia, setActiveMedia] = useState(activeVariant.image_url || product.images?.[0] || '/placeholder.png');
  const [quantity, setQuantity] = useState(1);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderData, setOrderData] = useState({ nama: '', noHp: '', alamat: '', catatan: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const formatRupiah = (number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

  // Gunakan harga dari varian aktif
  const currentPrice = activeVariant.price || product.price;
  const totalHarga = currentPrice * quantity;

  const handleOrderChange = (e) => {
    setOrderData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleVariantClick = (v) => {
    setActiveVariant(v);
    if (v.image_url) {
      setActiveMedia(v.image_url);
    }
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();

    let preorderInfo = '';
    if (product.is_preorder) {
      preorderInfo = `\n*Pre-Order*\nEstimasi: ${product.preorder_days || 7} hari\n`;
    }

    const msg = encodeURIComponent(
      `*ORDER ZAM EDUTOYS*\n\n` +
      `Produk  : ${product.title}\n` +
      `Varian  : ${activeVariant.name}\n` +
      `Jumlah  : ${quantity} pcs\n` +
      `Total   : ${formatRupiah(totalHarga)}\n` +
      preorderInfo +
      `\n*Data Pemesan*\n` +
      `Nama    : ${orderData.nama}\n` +
      `No. HP  : ${orderData.noHp}\n` +
      `Alamat  : ${orderData.alamat}\n` +
      (orderData.catatan ? `Catatan : ${orderData.catatan}\n` : '')
    );
    window.open(`https://wa.me/628995366864?text=${msg}`, '_blank');
    setSubmitted(true);
  };

  // Gabungkan semua media: Gambar produk + Gambar varian
  const allMedia = Array.from(new Set([
    ...(product.images || []),
    ...(product.product_variants?.map(v => v.image_url).filter(Boolean) || [])
  ]));

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>

        <div className={styles.layout}>
          {/* Gallery Column */}
          <div className={styles.gallery}>
            <div className={styles.mainMediaContainer}>
              {activeMedia.endsWith('.mp4') ? (
                <video src={activeMedia} className={styles.mainMedia} controls autoPlay muted />
              ) : (
                <Image src={activeMedia} alt={product.title} fill className={styles.mainMedia} />
              )}
            </div>
            <div className={styles.thumbnails}>
              {allMedia.map((media, i) => (
                <div
                  key={i}
                  className={`${styles.thumbnailWrapper} ${activeMedia === media ? styles.activeThumbnail : ''}`}
                  onClick={() => setActiveMedia(media)}
                >
                  {media.endsWith('.mp4') ? (
                    <video src={media} className={styles.thumbnailVideo} muted />
                  ) : (
                    <Image src={media} alt="thumbnail" fill className={styles.thumbnailImage} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Details Column */}
          <div className={styles.details}>
            <div className={styles.header}>
              <h2 className={styles.title}>{product.title}</h2>
              {product.categories && (
                <span className={styles.categoryBadge}>{product.categories.name}</span>
              )}
            </div>

            <div className={styles.priceContainer}>
              <span className={styles.price}>{formatRupiah(currentPrice)}</span>
              {product.is_preorder && (
                <span className={`${styles.stockLabel} ${styles.preorderLabel}`}>
                  Pre-Order ({product.preorder_days || 7} hari)
                </span>
              )}
              {!product.is_preorder && activeVariant.stock !== undefined && (
                <span className={styles.stockLabel}>Stok: {activeVariant.stock}</span>
              )}
            </div>

            {/* Variants */}
            {product.product_variants?.length > 0 && (
              <div className={styles.section}>
                <span className={styles.label}>Pilih Variasi</span>
                <div className={styles.variants}>
                  {product.product_variants.map(v => (
                    <button
                      key={v.id}
                      className={`${styles.variantBtn} ${activeVariant.id === v.id ? styles.variantActive : ''}`}
                      onClick={() => handleVariantClick(v)}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className={styles.section}>
              <span className={styles.label}>Kuantitas</span>
              <div className={styles.quantityBox}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                <input type="number" readOnly value={quantity} />
                <button onClick={() => setQuantity(q => q + 1)}>+</button>
              </div>
            </div>

            {/* Description */}
            <div className={styles.sectionCol}>
              <span className={styles.labelDesc}>Deskripsi Produk</span>
              <p className={styles.description}>{product.description}</p>
            </div>

            {/* Actions */}
            {!showOrderForm && (
              <div className={styles.actions}>
                <button
                  className={styles.orderBtn}
                  onClick={() => setShowOrderForm(true)}
                  disabled={activeVariant.stock === 0 && !product.is_preorder}
                >
                  {activeVariant.stock === 0 && !product.is_preorder
                    ? 'Stok Habis'
                    : product.is_preorder && activeVariant.stock === 0
                      ? `🛒 Pre-Order (${product.preorder_days || 7} hari)`
                      : '🛒 Order Sekarang'}
                </button>
              </div>
            )}

            {/* Order Summary & Form */}
            {showOrderForm && (
              <div className={styles.orderPanel}>
                {submitted ? (
                  <div className={styles.successMsg}>
                    <span>✅</span>
                    <p>Pesanan berhasil dikirim!</p>
                    <button className={styles.closeOrderBtn} onClick={onClose}>Tutup</button>
                  </div>
                ) : (
                  <>
                    <h3 className={styles.orderTitle}>Ringkasan Pesanan</h3>

                    <div className={styles.orderSummary}>
                      <div className={styles.summaryRow}>
                        <span>Produk</span>
                        <span className={styles.summaryVal}>{product.title}</span>
                      </div>
                      <div className={styles.summaryRow}>
                        <span>Varian</span>
                        <span className={styles.summaryVal}>{activeVariant.name}</span>
                      </div>
                      <div className={styles.summaryRow}>
                        <span>Jumlah</span>
                        <span className={styles.summaryVal}>{quantity} pcs</span>
                      </div>
                      <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                        <span>Total</span>
                        <span className={styles.totalVal}>{formatRupiah(totalHarga)}</span>
                      </div>
                    </div>

                    <form className={styles.orderForm} onSubmit={handleSubmitOrder}>
                      <div className={styles.fieldGroup}>
                        <label>Nama Lengkap *</label>
                        <input
                          type="text" name="nama" required
                          placeholder="Nama Anda"
                          value={orderData.nama} onChange={handleOrderChange}
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label>No. HP / WhatsApp *</label>
                        <input
                          type="tel" name="noHp" required
                          placeholder="08..."
                          value={orderData.noHp} onChange={handleOrderChange}
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label>Alamat Lengkap *</label>
                        <textarea
                          name="alamat" required rows={2}
                          placeholder="Alamat pengiriman"
                          value={orderData.alamat} onChange={handleOrderChange}
                        />
                      </div>

                      <div className={styles.formActions}>
                        <button type="button" className={styles.backBtn} onClick={() => setShowOrderForm(false)}>
                          ← Kembali
                        </button>
                        <button type="submit" className={styles.submitBtn}>
                          Konfirmasi WA
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

