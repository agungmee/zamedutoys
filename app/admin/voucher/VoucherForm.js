'use client';

import React, { useState } from 'react';
import { createVoucher, updateVoucher } from '@/app/actions/voucher';
import styles from './voucher.module.css';

export default function VoucherForm({ voucher, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    
    try {
      let result;
      if (voucher) {
        result = await updateVoucher(voucher.id, formData);
      } else {
        result = await createVoucher(formData);
      }

      if (result.success) {
        onSuccess();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Terjadi kesalahan sistem. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>{voucher ? 'Edit Voucher' : 'Buat Voucher Baru'}</h2>
        
        {error && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
            ⚠️ {error}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Kode Voucher</label>
            <input 
              type="text" name="code" required 
              placeholder="Contoh: ZAMHEMAT10"
              defaultValue={voucher?.code || ''}
              autoFocus
            />
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Tipe Diskon</label>
              <select name="discount_type" defaultValue={voucher?.discount_type || 'fixed'}>
                <option value="fixed">Potongan Tetap (Rp)</option>
                <option value="percentage">Persentase (%)</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Nilai Potongan</label>
              <input 
                type="number" name="discount_value" required 
                placeholder="10000 atau 10"
                defaultValue={voucher?.discount_value || ''}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Minimal Belanja</label>
              <input 
                type="number" name="min_purchase" required 
                placeholder="Rp 0 jika tidak ada"
                defaultValue={voucher?.min_purchase || 0}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Kuota Penggunaan</label>
              <input 
                type="number" name="quota" required 
                placeholder="999 jika tidak terbatas"
                defaultValue={voucher?.quota || 999}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Berlaku Sampai (Opsional)</label>
            <input 
              type="datetime-local" name="expires_at" 
              defaultValue={voucher?.expires_at ? new Date(voucher.expires_at).toISOString().slice(0, 16) : ''}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Status Aktivasi</label>
            <select name="is_active" defaultValue={voucher?.is_active !== false ? 'true' : 'false'}>
              <option value="true">Aktif</option>
              <option value="false">Non-aktif</option>
            </select>
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={loading}>
              Batal
            </button>
            <button type="submit" className={styles.saveBtn} disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Voucher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
