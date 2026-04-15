'use client';

import { useActionState, useEffect, useState } from 'react';
import { importProductsExcel } from '@/app/actions/admin';
import styles from './produk.module.css';

export default function ImportExcelModal({ onClose, onSuccess }) {
  const [state, formAction, pending] = useActionState(importProductsExcel, undefined);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (state?.success) {
      alert(state.message);
      onSuccess();
      onClose();
    }
  }, [state, onSuccess, onClose]);

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Import Produk dari Excel</h2>
          <button onClick={onClose} className={styles.closeBtn}>&times;</button>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.modalText}>
            Sistem pengisian kini lebih mudah! Setiap <strong>Varian</strong> memiliki barisnya sendiri. 
            Gunakan <strong>Nama Produk</strong> yang sama untuk menggabungkan beberapa varian ke dalam satu produk yang sama.
          </p>

          <a 
            href="/templates/product_template.xlsx" 
            download="Template_Import_Produk_ZAM.xlsx"
            className={styles.downloadTemplateBtn}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Template Excel
          </a>

          <hr className={styles.divider} />

          <form action={formAction} className={styles.importForm}>
            <div className={styles.uploadArea}>
              <input 
                type="file" 
                name="excel_file" 
                id="excel_file"
                accept=".xlsx, .xls"
                className={styles.hiddenInput}
                onChange={(e) => setFileName(e.target.files[0]?.name || '')}
                required
              />
              <label htmlFor="excel_file" className={styles.uploadLabel}>
                {fileName ? (
                  <span className={styles.fileName}>{fileName}</span>
                ) : (
                  <>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{opacity: 0.5}}>
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="12" y1="18" x2="12" y2="12" />
                      <line x1="9" y1="15" x2="15" y2="15" />
                    </svg>
                    <span>Klik untuk pilih file Excel</span>
                  </>
                )}
              </label>
            </div>

            {state?.error && <div className={styles.errorAlert}>{state.error}</div>}

            <div className={styles.modalActions}>
              <button type="button" onClick={onClose} className={styles.cancelBtn} disabled={pending}>Batal</button>
              <button type="submit" className={styles.submitBtn} disabled={pending}>
                {pending ? 'Sedang Mengimport...' : 'Mulai Import'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
