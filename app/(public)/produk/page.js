import React, { Suspense } from 'react';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import styles from './Produk.module.css';
import { getProducts } from '@/app/actions/admin';
import ProdukClient from './ProdukClient';

// Adapter: konversi format Supabase → format yang dipakai ProductCard
function adaptProduct(p) {
  return {
    id: p.id,
    title: p.title,
    price: p.price,
    original_price: p.original_price,
    rating: p.rating,
    sold: p.sold,
    media: p.images || [],
    stock: p.stock,
    variants: p.variants || [],
    brand: p.brand,
    category: p.category,
    tags: p.tags || [],
    description: p.description,
    whatsapp_msg: p.whatsapp_msg,
    is_preorder: p.is_preorder || false,
    preorder_days: p.preorder_days || 7,
    product_variants: p.product_variants || [],
    images: p.images || [],
    categories: p.categories,
  };
}

async function ProdukContent({ sortParam, categoryParam }) {
  let products = [];
  try {
    // Logic sorting sederhana: terbaru = order by created_at desc (default di getProducts)
    products = await getProducts({ category: categoryParam });

    // Jika ada logika khusus untuk 'terlaris', bisa ditambahkan di sini
    // Untuk saat ini kita gunakan data yang sama
  } catch (err) {
    console.error("Error loading products:", err);
  }

  const adaptedProducts = products.map(adaptProduct);

  return (
    <ProdukClient
      products={adaptedProducts}
      sortParam={sortParam}
      categoryParam={categoryParam}
    />
  );
}

export const metadata = {
  title: 'Katalog Produk',
  description: 'Temukan pilihan lengkap mainan edukasi dari ZAM Edutoys. Beli produk terbaik untuk melatih keterampilan anak.',
  openGraph: {
    title: 'Katalog Produk | ZAM Edutoys',
    description: 'Beli koleksi terbaru mainan anak edukatif kami, dirancang khusus dengan bahan berkualitas premium.',
  }
};

export default async function ProdukPage({ searchParams }) {
  const { sort = 'terbaru', category } = await searchParams;

  return (
    <Suspense fallback={<div className={styles.loading}>Memuat produk...</div>}>
      <ProdukContent sortParam={sort} categoryParam={category} />
    </Suspense>
  );
}

