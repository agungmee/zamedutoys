import { createProduct } from '@/app/actions/admin';
import ProductForm from '../ProductForm';
import styles from '../form.module.css';

export const metadata = {
  title: 'Tambah Produk — ZAM Edutoys Admin',
};

export default function TambahProdukPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <a href="/admin/produk" className={styles.backLink}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Kembali
          </a>
          <h1 className={styles.title}>Tambah Produk</h1>
        </div>
      </div>
      <ProductForm action={createProduct} />
    </div>
  );
}
