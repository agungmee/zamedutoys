'use client';

import React, { useState } from 'react';
import { deleteVoucher } from '@/app/actions/voucher';
import VoucherForm from './VoucherForm';
import styles from './voucher.module.css';

export default function VoucherTable({ initialVouchers }) {
  const [vouchers, setVouchers] = useState(initialVouchers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);

  const formatRupiah = (number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus voucher ini?')) {
      const result = await deleteVoucher(id);
      if (result.success) {
        setVouchers(vouchers.filter(v => v.id !== id));
      } else {
        alert('Gagal menghapus voucher: ' + result.error);
      }
    }
  };

  const handleEdit = (voucher) => {
    setEditingVoucher(voucher);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingVoucher(null);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1>Manajemen Voucher</h1>
          <p>Kelola kode diskon dan promo untuk pelanggan.</p>
        </div>
        <button className={styles.addBtn} onClick={handleAddNew}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Buat Voucher Baru
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Kode</th>
              <th>Tipe</th>
              <th>Nilai Potongan</th>
              <th>Min. Belanja</th>
              <th>Penggunaan</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', py: '3rem', color: '#999' }}>
                  Belum ada voucher yang dibuat.
                </td>
              </tr>
            ) : (
              vouchers.map((v) => (
                <tr key={v.id}>
                  <td><span className={styles.voucherCode}>{v.code}</span></td>
                  <td>{v.discount_type === 'percentage' ? 'Persentase' : 'Potongan Tetap'}</td>
                  <td>
                    {v.discount_type === 'percentage' 
                      ? `${v.discount_value}%` 
                      : formatRupiah(v.discount_value)}
                  </td>
                  <td>{formatRupiah(v.min_purchase)}</td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{v.used_count || 0}</span> / {v.quota || '∞'}
                  </td>
                  <td>
                    <span className={`${styles.badge} ${v.is_active ? styles.active : styles.inactive}`}>
                      {v.is_active ? 'Aktif' : 'Non-aktif'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.editBtn} title="Edit" onClick={() => handleEdit(v)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button className={styles.deleteBtn} title="Hapus" onClick={() => handleDelete(v.id)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <VoucherForm 
          voucher={editingVoucher} 
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            window.location.reload();
          }}
        />
      )}
    </>
  );
}
