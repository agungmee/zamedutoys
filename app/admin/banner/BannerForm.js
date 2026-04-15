'use client';

import { useActionState, useEffect, useState, useRef } from 'react';
import { createBanner, updateBanner } from '@/app/actions/banner';
import Image from 'next/image';
import styles from './banner.module.css';

export default function BannerForm({ initialData, onCancel, onSuccess }) {
  const isEditing = !!initialData;
  const action = isEditing ? updateBanner.bind(null, initialData.id) : createBanner;
  const [state, formAction, pending] = useActionState(action, undefined);
  
  const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'url'
  const [preview, setPreview] = useState(initialData?.image_url || null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (state?.success) onSuccess();
  }, [state, onSuccess]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e) => {
    setPreview(e.target.value);
  };

  return (
    <form action={formAction}>
      <h2 className={styles.formTitle}>{isEditing ? 'Edit Banner' : 'Tambah Banner'}</h2>
      
      {state?.error && <div className={styles.errorAlert}>{state.error}</div>}

      <div className={styles.uploadToggle}>
        <button 
          type="button" 
          className={`${styles.toggleBtn} ${uploadMode === 'file' ? styles.activeToggle : ''}`}
          onClick={() => setUploadMode('file')}
        >
          Upload File
        </button>
        <button 
          type="button" 
          className={`${styles.toggleBtn} ${uploadMode === 'url' ? styles.activeToggle : ''}`}
          onClick={() => setUploadMode('url')}
        >
          Link Gambar
        </button>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>
          {uploadMode === 'file' ? 'Unggah Gambar' : 'URL Gambar'}
        </label>
        
        {uploadMode === 'file' ? (
          <div className={styles.fileUploadArea} onClick={() => fileInputRef.current.click()}>
            <input 
              type="file" 
              name="banner_file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleFileChange}
              className={styles.hiddenInput}
            />
            {preview ? (
              <div className={styles.formPreview}>
                <Image src={preview} alt="Preview" fill className={styles.previewImage} />
                <div className={styles.changeOverlay}>Ganti Gambar</div>
              </div>
            ) : (
              <div className={styles.uploadPlaceholder}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span>Pilih file gambar...</span>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.urlInputArea}>
            <input 
              name="image_url" 
              defaultValue={initialData?.image_url} 
              onBlur={handleUrlChange}
              className={styles.input} 
              placeholder="https://example.com/image.jpg" 
            />
            {preview && (
              <div className={styles.formPreviewSmall}>
                <Image src={preview} alt="Preview" fill className={styles.previewImage} />
              </div>
            )}
          </div>
        )}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Judul</label>
          <input name="title" defaultValue={initialData?.title} className={styles.input} placeholder="Promo Spesial" />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Urutan</label>
          <input name="display_order" type="number" defaultValue={initialData?.display_order || 0} className={styles.input} />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Link Web (Opsional)</label>
        <input name="link_url" defaultValue={initialData?.link_url} className={styles.input} placeholder="/produk/nama-produk" />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Status Tampil</label>
        <select name="is_active" className={styles.input} defaultValue={initialData?.is_active?.toString() || 'true'}>
          <option value="true">Aktif</option>
          <option value="false">Nonaktif</option>
        </select>
      </div>

      <div className={styles.formActions}>
        <button type="button" onClick={onCancel} className={styles.cancelBtn}>Batal</button>
        <button type="submit" className={styles.submitBtn} disabled={pending}>
          {pending ? 'Sedang Memproses...' : (isEditing ? 'Simpan Perubahan' : 'Tambah Banner')}
        </button>
      </div>
    </form>
  );
}
