import React, { Suspense } from 'react';
import { getProducts } from '@/app/actions/admin';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import styles from '../Kategori.module.css';
import CategoryClient from './CategoryClient';

// Adapter: konversi format Supabase → format yang dipakai ProductCard
function adaptProduct(p) {
  return {
    id: p.id,
    title: p.title,
    price: p.price,
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
  };
}

async function CategoryContent({ slug }) {
  const supabase = await createClient();
  
  // Ambil nama kategori dari database berdasarkan slug
  let categoryName = 'Kategori';
  const { data: categoryData } = await supabase
    .from('categories')
    .select('name')
    .eq('slug', slug)
    .single();
    
  if (categoryData) {
    categoryName = categoryData.name;
  }
  
  let products = [];
  try {
    products = await getProducts({ category: categoryName });
  } catch (err) {
    console.error("Error loading category products:", err);
  }

  const adaptedProducts = products.map(adaptProduct);

  return (
    <CategoryClient 
      products={adaptedProducts} 
      categoryName={categoryName} 
    />
  );
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('categories').select('name, description, image_url').eq('slug', slug).single();
  
  if (!data) return { title: 'Kategori' };
  
  return {
    title: `Jual Mainan Edukasi ${data.name}`,
    description: data.description || `Temukan koleksi produk ${data.name} terbaik di ZAM Edutoys.`,
    openGraph: {
      title: `Mainan Edukasi ${data.name} | ZAM Edutoys`,
      description: data.description || `Koleksi produk ${data.name} dari ZAM Edutoys.`,
      images: data.image_url ? [data.image_url] : [],
    }
  };
}

export default async function CategoryDetailPage({ params }) {
  const { slug } = await params;

  return (
    <Suspense fallback={<div className={styles.loading}>Memuat produk...</div>}>
      <CategoryContent slug={slug} />
    </Suspense>
  );
}

