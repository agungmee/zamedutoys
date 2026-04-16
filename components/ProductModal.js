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
  
  // Voucher states
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  
  // Shipping states
  const [selectedShipping, setSelectedShipping] = useState('');

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const formatRupiah = (number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

    // Use price from active variant
    const currentPrice = activeVariant.price || product.price;
    const originalPrice = activeVariant.original_price || product.original_price;
    const hasDiscount = originalPrice && originalPrice > currentPrice;
    const discountPercent = hasDiscount ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;
    
    // Subtotal
    const subtotal = currentPrice * quantity;
    
    // Calculate voucher discount
    let voucherDiscount = 0;
    if (appliedVoucher) {
      if (appliedVoucher.discount_type === 'percentage') {
        voucherDiscount = (subtotal * appliedVoucher.discount_value) / 100;
        // Optional: limit to max_discount if implemented
      } else {
        voucherDiscount = appliedVoucher.discount_value;
      }
    }
    
    const totalHarga = Math.max(0, subtotal - voucherDiscount);

    const handleOrderChange = (e) => {
      setOrderData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleVariantClick = (v) => {
      setActiveVariant(v);
      if (v.image_url) {
        setActiveMedia(v.image_url);
      }
      // Re-validate voucher if variant changes (prices might change)
      if (appliedVoucher) {
        setAppliedVoucher(null);
        setVoucherError('Harga berubah, silakan masukan ulang voucher.');
      }
    };

    const handleApplyVoucher = async () => {
      if (!voucherCode) return;
      setIsValidating(true);
      setVoucherError(null);
      
      const { validateVoucher } = await import('@/app/actions/voucher');
      const result = await validateVoucher(voucherCode, subtotal);
      
      if (result.success) {
        setAppliedVoucher(result.voucher);
        setVoucherError(null);
      } else {
        setVoucherError(result.error);
        setAppliedVoucher(null);
      }
      setIsValidating(false);
    };

    const handleRemoveVoucher = () => {
      setAppliedVoucher(null);
      setVoucherCode('');
      setVoucherError(null);
    };

    const handleSubmitOrder = (e) => {
      e.preventDefault();

      let preorderInfo = '';
      if (product.is_preorder) {
        preorderInfo = `\n*Pre-Order*\nEstimasi: ${product.preorder_days || 7} hari\n`;
      }

      const voucherLine = appliedVoucher 
        ? `${appliedVoucher.code} (- ${formatRupiah(voucherDiscount)})` 
        : '-';

      const msg = encodeURIComponent(
        `*ORDER ZAM EDUTOYS*\n` +
        `Produk  : ${product.title}\n` +
        `Varian  : ${activeVariant.name}\n` +
        `Jumlah  : ${quantity} pcs\n` +
        `Total   : ${formatRupiah(totalHarga)}\n\n` +
        
        `Voucher diskon : ${voucherLine}\n` +
        `Estimasi berat/volume (kg) : ${product.weight_kg || 0} kg\n\n` +
        
        `*Data Pemesan*\n\n` +
        `Nama    : ${orderData.nama}\n` +
        `No. HP  : ${orderData.noHp}\n` +
        `Alamat  : ${orderData.alamat}\n\n` +
        
        `Ekspedisi pilihan : ${selectedShipping || '-'}` +
        preorderInfo +
        (orderData.catatan ? `\nCatatan : ${orderData.catatan}` : '')
      );
      window.open(`https://wa.me/628995366864?text=${msg}`, '_blank');
      setSubmitted(true);
    };

    // Combine all media: Product images + Variant images
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
                {hasDiscount && (
                  <span className={styles.discountBadge}>{discountPercent}% OFF</span>
                )}
              </div>

              <div className={styles.priceContainer}>
                <div className={styles.priceWrapper}>
                  <span className={styles.price}>{formatRupiah(currentPrice)}</span>
                  {hasDiscount && (
                    <span className={styles.originalPrice}>{formatRupiah(originalPrice)}</span>
                  )}
                </div>
                
                <div className={styles.stockRow}>
                  {product.is_preorder && (
                    <span className={`${styles.stockLabel} ${styles.preorderLabel}`}>
                      Pre-Order ({product.preorder_days || 7} hari)
                    </span>
                  )}
                  {!product.is_preorder && activeVariant.stock !== undefined && (
                    <span className={styles.stockLabel}>Stok: {activeVariant.stock}</span>
                  )}
                </div>
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
                        <span>Subtotal</span>
                        <span className={styles.summaryVal}>{formatRupiah(subtotal)}</span>
                      </div>
                      
                      {appliedVoucher && (
                        <div className={`${styles.summaryRow} ${styles.discountRow}`}>
                          <span>Diskon ({appliedVoucher.code})</span>
                          <span className={styles.discountVal}>- {formatRupiah(voucherDiscount)}</span>
                        </div>
                      )}
                      
                      <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                        <span>Total</span>
                        <span className={styles.totalVal}>{formatRupiah(totalHarga)}</span>
                      </div>
                    </div>

                    {/* Voucher Input Section */}
                    <div className={styles.voucherSection}>
                      <label className={styles.formLabel}>Punya Kode Voucher?</label>
                      {!appliedVoucher ? (
                        <div className={styles.voucherContainer}>
                          <div className={styles.voucherInputGroup}>
                            <input 
                              type="text" 
                              placeholder="MASUKKAN KODE VOUCHER" 
                              value={voucherCode}
                              className={styles.voucherInput}
                              onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                            />
                            <button 
                              className={styles.applyVoucherBtn}
                              type="button"
                              onClick={handleApplyVoucher}
                              disabled={isValidating || !voucherCode}
                            >
                              {isValidating ? '...' : 'Gunakan'}
                            </button>
                          </div>
                          {voucherError && <p className={styles.voucherError}>{voucherError}</p>}
                        </div>
                      ) : (
                        <div className={styles.voucherSuccess}>
                          <div className={styles.voucherSuccessContent}>
                            <span className={styles.checkBadge}>✓</span>
                            <span>Voucher <b>{appliedVoucher.code}</b> terpasang!</span>
                          </div>
                          <button type="button" className={styles.removeVoucherBtn} onClick={handleRemoveVoucher}>
                            Hapus
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Shipping Options Section */}
                    <div className={styles.shippingSection}>
                      <label className={styles.formLabel}>Pilih Ekspedisi</label>
                      <div className={styles.selectWrapper}>
                        <select 
                          className={styles.shippingSelect}
                          value={selectedShipping}
                          onChange={(e) => setSelectedShipping(e.target.value)}
                        >
                          <option value="">-- Pilih Ekspedisi --</option>
                          <optgroup label="Layanan Reguler">
                            <option value="J&T Express">J&T Express</option>
                            <option value="JNE">JNE</option>
                            <option value="Wahana">Wahana</option>
                            <option value="Lion">Lion</option>
                          </optgroup>
                          <optgroup label="Layanan Kargo (Hemat)">
                            <option value="Sentral Cargo">Sentral Cargo</option>
                            <option value="J&T Cargo">J&T Cargo</option>
                            <option value="Indah Cargo">Indah Cargo</option>
                          </optgroup>
                          <optgroup label="Lainnya">
                            <option value="Kurir Toko">Kurir Toko</option>
                            <option value="Ambil di workshop">Ambil di workshop</option>
                          </optgroup>
                        </select>
                      </div>
                    </div>

                      {/* Weight Recommendation */}
                      {(product.weight_kg > 5) && (
                        <div className={styles.weightWarning}>
                          <span className={styles.warningIcon}>⚖️</span>
                          <p className={styles.warningText}>
                            Produk ini memiliki estimasi berat {product.weight_kg}kg. <br/>
                            Disarankan menggunakan layanan <b>Kargo</b> agar ongkir lebih hemat.
                          </p>
                        </div>
                      )}

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

