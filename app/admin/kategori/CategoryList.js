'use client';

import { useState } from 'react';
import { deleteCategory } from '@/app/actions/category';
import CategoryForm from './CategoryForm';
import styles from './kategori.module.css';

export default function CategoryList({ initialCategories }) {
  const [categories, setCategories] = useState(initialCategories);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      const res = await deleteCategory(id);
      if (res.success) {
        setCategories(categories.filter(c => c.id !== id));
      } else {
        alert('Gagal menghapus kategori: ' + res.error);
      }
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const handleSuccess = () => {
    setShowModal(false);
    // Refreshing categories (simplest way is window.location for server revalidation)
    window.location.reload();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.listGrid}>
        <button className={styles.addCard} onClick={handleCreate}>
          <span>+ Tambah Kategori Baru</span>
        </button>

        {categories.map((cat) => (
          <div key={cat.id} className={styles.card}>
            <div className={styles.info}>
              <h3>{cat.name}</h3>
              <p>/{cat.slug}</p>
            </div>
            <div className={styles.actions}>
              <button className={styles.btnIcon} onClick={() => handleEdit(cat)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
              <button className={`${styles.btnIcon} ${styles.deleteBtn}`} onClick={() => handleDelete(cat.id)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <CategoryForm 
              onCancel={() => setShowModal(false)} 
              onSuccess={handleSuccess}
              initialData={editingCategory}
            />
          </div>
        </div>
      )}
    </div>
  );
}
