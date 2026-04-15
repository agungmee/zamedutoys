import { getCategories } from '@/app/actions/category';
import CategoryList from './CategoryList';
import styles from './kategori.module.css';

export const metadata = {
  title: 'Kelola Kategori — ZAM Edutoys Admin',
};

export default async function KategoriPage() {
  const categories = await getCategories();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Kelola Kategori</h1>
        <p className={styles.subtitle}>Atur kategori produk untuk memudahkan pelanggan.</p>
      </header>

      <CategoryList initialCategories={categories} />
    </div>
  );
}
