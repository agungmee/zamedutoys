import { getAllProductsAdmin } from '@/app/actions/admin';
import ProductsTable from './ProductsTable';
import ProductHeader from './ProductHeader';
import styles from './produk.module.css';

export const metadata = {
  title: 'Kelola Produk — ZAM Edutoys Admin',
};

export default async function AdminProdukPage() {
  const products = await getAllProductsAdmin().catch(() => []);

  return (
    <div className={styles.page}>
      <ProductHeader productCount={products.length} />

      <ProductsTable products={products} />
    </div>
  );
}
