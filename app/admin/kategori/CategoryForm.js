'use client';

import { useActionState, useEffect } from 'react';
import { createCategory, updateCategory } from '@/app/actions/category';
import styles from './kategori.module.css';

export default function CategoryForm({ onCancel, onSuccess, initialData }) {
  const isEditing = !!initialData;
  const action = isEditing ? updateCategory.bind(null, initialData.id) : createCategory;
  const [state, formAction, pending] = useActionState(action, undefined);

  useEffect(() => {
    if (state?.success) {
      onSuccess();
    }
  }, [state, onSuccess]);

  return (
    <form action={formAction}>
      <h2 className={styles.formTitle}>
        {isEditing ? 'Edit Kategori' : 'Tambah Kategori'}
      </h2>

      {state?.error && (
        <div className={styles.errorAlert}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {state.error}
        </div>
      )}

      <div className={styles.field}>
        <label className={styles.label}>Nama Kategori *</label>
        <input 
          name="name" 
          type="text" 
          className={styles.input} 
          defaultValue={initialData?.name || ''} 
          placeholder="Contoh: Permaianan Edukasi"
          required 
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Slug (Opsional)</label>
        <input 
          name="slug" 
          type="text" 
          className={styles.input} 
          defaultValue={initialData?.slug || ''} 
          placeholder="contoh-slug-kategori"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>URL Gambar (Opsional)</label>
        <input 
          name="image_url" 
          type="text" 
          className={styles.input} 
          defaultValue={initialData?.image_url || ''} 
          placeholder="/icons/category-icon.png"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Deskripsi (Opsional)</label>
        <textarea 
          name="description" 
          className={styles.input} 
          rows={3} 
          defaultValue={initialData?.description || ''} 
          placeholder="Jelaskan kegunaan kategori ini..."
        />
      </div>

      <div className={styles.formActions}>
        <button type="button" onClick={onCancel} className={styles.cancelBtn}>
          Batal
        </button>
        <button type="submit" className={styles.submitBtn} disabled={pending}>
          {pending ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Tambah Kategori')}
        </button>
      </div>
    </form>
  );
}
