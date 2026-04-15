'use client';

import { useState } from 'react';
import Image from 'next/image';
import { deleteBanner, toggleBannerActive } from '@/app/actions/banner';
import BannerForm from './BannerForm';
import styles from './banner.module.css';

export default function BannerList({ initialBanners }) {
  const [banners, setBanners] = useState(initialBanners);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  const handleDelete = async (id) => {
    if (confirm('Hapus banner ini?')) {
      const res = await deleteBanner(id);
      if (res.success) setBanners(banners.filter(b => b.id !== id));
    }
  };

  const handleToggle = async (id, status) => {
    await toggleBannerActive(id, status);
    setBanners(banners.map(b => b.id === id ? { ...b, is_active: !status } : b));
  };

  const openAdd = () => {
    setEditingBanner(null);
    setShowModal(true);
  };

  const openEdit = (banner) => {
    setEditingBanner(banner);
    setShowModal(true);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.listGrid}>
        <button className={styles.addCard} onClick={openAdd}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Tambah Banner Baru</span>
        </button>

        {banners.map((b) => (
          <div key={b.id} className={styles.card}>
            <div className={styles.preview}>
              <Image src={b.image_url} alt={b.title || 'Banner'} fill className={styles.cardImage} />
              {!b.is_active && <div className={styles.inactiveOverlay}>NONAKTIF</div>}
            </div>
            
            <div className={styles.cardContent}>
              <div className={styles.cardTop}>
                <h3 className={styles.cardTitle}>{b.title || 'Tanpa Judul'}</h3>
                <span className={styles.orderBadge}>#{b.display_order}</span>
              </div>
              
              {b.link_url && <span className={styles.cardLink}>{b.link_url}</span>}
              
              <div className={styles.cardActions}>
                <button className={styles.btnAction} onClick={() => handleToggle(b.id, b.is_active)} title={b.is_active ? 'Nonaktifkan' : 'Aktifkan'}>
                  {b.is_active ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 011.85-2.61M12 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  )}
                </button>
                <button className={styles.btnAction} onClick={() => openEdit(b)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                </button>
                <button className={`${styles.btnAction} ${styles.btnDelete}`} onClick={() => handleDelete(b.id)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <BannerForm 
              initialData={editingBanner} 
              onCancel={() => setShowModal(false)} 
              onSuccess={() => window.location.reload()} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
