"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './ProductModal.module.css';

export default function ProductModal({ product, onClose }) {
  const [activeMedia, setActiveMedia] = useState(product.media[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeVariant, setActiveVariant] = useState(product.variants[0]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderData, setOrderData] = useState({ nama: '', noHp: '', alamat: '', catatan: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const formatRupiah = (number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

  const totalHarga = product.price * quantity;

  const handleOrderChange = (e) => {
    setOrderData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `*ORDER ZAM EDUTOYS*\n\n` +
      `Produk  : ${product.title}\n` +
      `Varian  : ${activeVariant}\n` +
      `Jumlah  : ${quantity} pcs\n` +
      `Total   : ${formatRupiah(totalHarga)}\n\n` +
      `*Data Pemesan*\n` +
      `Nama    : ${orderData.nama}\n` +
      `No. HP  : ${orderData.noHp}\n` +
      `Alamat  : ${orderData.alamat}\n` +
      (orderData.catatan ? `Catatan : ${orderData.catatan}\n` : '')
    );
    window.open(`https://wa.me/6281234567890?text=${msg}`, '_blank');
    setSubmitted(true);
  };

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
              {product.media.map((media, i) => (
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
            </div>

            <div className={styles.priceContainer}>
              <span className={styles.price}>{formatRupiah(product.price)}</span>
            </div>

            {/* Variants */}
            <div className={styles.section}>
              <span className={styles.label}>Varian</span>
              <div className={styles.variants}>
                {product.variants.map(v => (
                  <button
                    key={v}
                    className={`${styles.variantBtn} ${activeVariant === v ? styles.variantActive : ''}`}
                    onClick={() => setActiveVariant(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className={styles.section}>
              <span className={styles.label}>Kuantitas</span>
              <div className={styles.quantityBox}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                <input type="number" readOnly value={quantity} />
                <button onClick={() => setQuantity(q => q + 1)}>+</button>
                <span className={styles.stock}>Tersisa &gt;10</span>
              </div>
            </div>

            {/* Description */}
            <div className={styles.sectionCol}>
              <span className={styles.labelDesc}>Deskripsi Produk</span>
              <p className={styles.description}>{product.description}</p>
            </div>

            {/* Single Order Button */}
            {!showOrderForm && (
              <div className={styles.actions}>
                <button className={styles.orderBtn} onClick={() => setShowOrderForm(true)}>
                  🛒 Order Sekarang
                </button>
              </div>
            )}

            {/* Order Summary & Form */}
            {showOrderForm && (
              <div className={styles.orderPanel}>
                {submitted ? (
                  <div className={styles.successMsg}>
                    <span>✅</span>
                    <p>Pesanan berhasil dikirim! Tim kami akan segera menghubungi Anda via WhatsApp.</p>
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
                        <span className={styles.summaryVal}>{activeVariant}</span>
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
                          placeholder="Masukkan nama lengkap Anda"
                          value={orderData.nama} onChange={handleOrderChange}
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label>No. HP / WhatsApp *</label>
                        <input
                          type="tel" name="noHp" required
                          placeholder="Contoh: 081234567890"
                          value={orderData.noHp} onChange={handleOrderChange}
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label>Alamat Lengkap *</label>
                        <textarea
                          name="alamat" required rows={3}
                          placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota, Kode Pos"
                          value={orderData.alamat} onChange={handleOrderChange}
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label>Catatan (opsional)</label>
                        <input
                          type="text" name="catatan"
                          placeholder="Warna, ukuran spesifik, atau permintaan lainnya"
                          value={orderData.catatan} onChange={handleOrderChange}
                        />
                      </div>

                      <div className={styles.formActions}>
                        <button type="button" className={styles.backBtn} onClick={() => setShowOrderForm(false)}>
                          ← Kembali
                        </button>
                        <button type="submit" className={styles.submitBtn}>
                          Konfirmasi via WhatsApp
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
