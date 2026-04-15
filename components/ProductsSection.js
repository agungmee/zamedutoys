import { getProducts } from '@/app/actions/admin';
import ProductsSectionClient from './ProductsSectionClient';

export default async function ProductsSection({ title = "Produk Terbaru", reverse = false }) {
  // Fetch dari Supabase server-side
  let products = [];
  try {
    products = await getProducts({
      featured: reverse ? true : undefined,
    });
    // Jika reverse (Terlaris), filter featured; else sort biasa
    if (reverse) {
      products = products.filter(p => p.is_featured);
    }
    if (products.length === 0) {
      // Fallback: ambil semua produk kalau filter kosong
      products = await getProducts({});
    }
  } catch (err) {
    console.error('Failed to load products from Supabase:', err);
  }

  return (
    <ProductsSectionClient
      title={title}
      products={products}
      reverse={reverse}
    />
  );
}
