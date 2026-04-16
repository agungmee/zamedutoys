'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { deleteProduct, toggleProductActive } from '@/app/actions/admin';
import styles from './produk.module.css';

export default function ProductsTable({ products }) {
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [search, setSearch] = useState('');
  const [showConfirmDeleteId, setShowConfirmDeleteId] = useState(null);
  const [isPending, startTransition] = useTransition();

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(id, title) {
    console.log(`[CLIENT] Triggering delete for: ${id} (${title})`);
    
    startTransition(async () => {
      setDeletingId(id);
      try {
        const result = await deleteProduct(id);
        if (result?.error) {
          alert(`Gagal menghapus: ${result.error}`);
        } else {
          console.log(`[CLIENT] Delete success for: ${id}`);
          setShowConfirmDeleteId(null);
        }
      } catch (err) {
        console.error('[CLIENT] Error deleting product:', err);
        alert('Terjadi kesalahan sistem saat mencoba menghapus produk.');
      } finally {
        setDeletingId(null);
      }
    });
  }

  async function handleToggle(id, status) {
    setTogglingId(id);
    await toggleProductActive(id, status);
    setTogglingId(null);
  }

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            id="product-search"
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <span className={styles.resultCount}>{filtered.length} produk</span>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📦</div>
          <p>{search ? `Tidak ada produk untuk "${search}"` : 'Belum ada produk. Tambahkan yang pertama!'}</p>
          {!search && (
            <Link href="/admin/produk/tambah" className={styles.emptyBtn}>+ Tambah Produk</Link>
          )}
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Produk</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Stok</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => (
                <tr key={product.id} className={deletingId === product.id ? styles.deleting : ''}>
                  <td>
                    <div className={styles.productCell}>
                      <div className={styles.productThumb}>
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.title} />
                        ) : (
                          <span>📦</span>
                        )}
                      </div>
                      <div className={styles.productMeta}>
                        <span className={styles.productName}>{product.title}</span>
                        {product.is_featured && (
                          <span className={styles.featuredBadge}>⭐ Unggulan</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={styles.categoryTag}>{product.category || '—'}</span>
                  </td>
                  <td className={styles.priceCell}>
                    <div className={styles.priceWrapper}>
                      {product.original_price && (
                        <span className={styles.oldPriceAdmin}>
                          Rp {Number(product.original_price).toLocaleString('id-ID')}
                        </span>
                      )}
                      <span className={styles.newPriceAdmin}>
                        Rp {Number(product.price).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={product.stock <= 5 ? styles.stockLow : styles.stockOk}>
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    <button
                      id={`toggle-${product.id}`}
                      onClick={() => handleToggle(product.id, product.is_active)}
                      disabled={togglingId === product.id}
                      className={`${styles.toggleBtn} ${product.is_active ? styles.toggleActive : styles.toggleInactive}`}
                    >
                      {togglingId === product.id ? '...' : product.is_active ? 'Aktif' : 'Nonaktif'}
                    </button>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link
                        href={`/admin/produk/${product.id}/edit`}
                        className={styles.editBtn}
                        title="Edit"
                      >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>

                      {showConfirmDeleteId === product.id ? (
                        <div className={styles.confirmGroup}>
                          <button 
                            className={styles.yakinBtn} 
                            onClick={() => handleDelete(product.id, product.title)}
                            disabled={deletingId === product.id}
                          >
                            {deletingId === product.id ? '...' : 'Yakin?'}
                          </button>
                          <button 
                            className={styles.batalBtn} 
                            onClick={() => setShowConfirmDeleteId(null)}
                            disabled={deletingId === product.id}
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <button
                          id={`delete-${product.id}`}
                          onClick={() => setShowConfirmDeleteId(product.id)}
                          disabled={deletingId === product.id}
                          className={styles.deleteBtn}
                          title="Hapus"
                        >
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M9 6V4h6v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
