import { getProduct, updateProduct } from '@/app/actions/admin';
import { notFound } from 'next/navigation';
import ProductForm from '../../ProductForm';
import styles from '../../form.module.css';

export const metadata = {
  title: 'Edit Produk — ZAM Edutoys Admin',
};

export default async function EditProdukPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  // Bind ID ke updateProduct
  const updateProductWithId = updateProduct.bind(null, id);

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
          <h1 className={styles.title}>Edit Produk</h1>
          <p className={styles.subtitle}>{product.title}</p>
        </div>
      </div>
      <ProductForm action={updateProductWithId} defaultValues={product} />
    </div>
  );
}
