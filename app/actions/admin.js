'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { uploadFile, deleteFilesFromUrls } from '@/lib/storage';
import * as XLSX from 'xlsx';

// === GET ALL PRODUCTS ===
export async function getProducts({ category, search, limit, featured } = {}) {
  const supabase = await createClient();

  let query = supabase
    .from('products')
    .select('*, categories(*), product_variants(*)')
    .eq('is_active', true)
    .filter('images', 'neq', '{}')
    .order('created_at', { ascending: false });

  if (category) query = query.eq('category', category);
  if (search) query = query.ilike('title', `%${search}%`);
  if (featured !== undefined) query = query.eq('is_featured', featured);
  if (limit) query = query.limit(limit);

  try {
    const { data, error } = await query;
    if (error) {
      console.error('getProducts error:', error.message);
      return [];
    }

    // Auto-convert: products with images but 0 stock become pre-order
    return (data || []).map(p => {
      const totalStock = p.product_variants?.length > 0 
        ? p.product_variants.reduce((sum, v) => sum + (v.stock || 0), 0)
        : (p.stock || 0);
        
      return {
        ...p,
        stock: totalStock,
        is_preorder: p.is_preorder || (totalStock === 0 && p.images && p.images.length > 0),
        preorder_days: p.preorder_days || ((totalStock === 0 && p.images && p.images.length > 0) ? 7 : p.preorder_days),
      };
    });
  } catch (err) {
    console.error('getProducts unexpected error:', err);
    return [];
  }
}

// === GET ALL PRODUCTS (termasuk non-aktif, untuk admin) ===
export async function getAllProductsAdmin() {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(*), product_variants(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('getAllProductsAdmin error:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('getAllProductsAdmin unexpected error:', err);
    return [];
  }
}

// === GET SINGLE PRODUCT ===
export async function getProduct(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*), product_variants(*)')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

// === CREATE PRODUCT ===
export async function createProduct(prevState, formData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Tidak terotorisasi.' };

  // Parse data
  const imagesRaw = formData.get('images') || '';
  const tagsRaw = formData.get('tags') || '';

  // --- HANDLE GALLERY IMAGES ---
  const galleryUrls = imagesRaw.split('\n').map(s => s.trim()).filter(Boolean);
  const galleryFiles = formData.getAll('gallery_files');

  if (galleryFiles && galleryFiles.length > 0) {
    for (const file of galleryFiles) {
      if (file.size > 0) {
        const url = await uploadFile(supabase, 'products', file);
        if (url) galleryUrls.push(url);
      }
    }
  }

  const product = {
    title: formData.get('title'),
    description: formData.get('description'),
    price: Number(formData.get('price')) || 0,
    price_grosir: Number(formData.get('price_grosir')) || null,
    category_id: formData.get('category_id') || null,
    brand: formData.get('brand') || 'ZAM Edutoys',
    images: galleryUrls,
    tags: tagsRaw.split(',').map(s => s.trim()).filter(Boolean),
    stock: Number(formData.get('stock')) || 0,
    sold: formData.get('sold') || '0',
    rating: Number(formData.get('rating')) || 5.0,
    whatsapp_msg: formData.get('whatsapp_msg'),
    is_featured: formData.get('is_featured') === 'true',
    is_active: formData.get('is_active') !== 'false',
    is_preorder: formData.get('is_preorder') === 'true',
    preorder_days: Number(formData.get('preorder_days')) || 7,
    video_url: formData.get('video_url') || null,
  };

  // --- HANDLE VIDEO UPLOAD ---
  const videoFile = formData.get('video_file');
  if (videoFile && videoFile.size > 0) {
    const vUrl = await uploadFile(supabase, 'products', videoFile);
    if (vUrl) product.video_url = vUrl;
  }

  if (!product.title) return { error: 'Nama produk wajib diisi.' };

  // Insert product first to get ID
  const { data: newProd, error: prodError } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();

  if (prodError) return { error: prodError.message };

  // --- HANDLE VARIANTS ---
  const variantsJson = formData.get('variants_json');
  if (variantsJson) {
    try {
      const variants = JSON.parse(variantsJson);
      if (variants.length > 0) {
        const variantsToInsert = [];
        for (let i = 0; i < variants.length; i++) {
          const v = variants[i];
          let vImageUrl = v.image_url;

          // Check for variant file upload
          const vFile = formData.get(`variant_file_${i}`);
          if (vFile && vFile.size > 0) {
            vImageUrl = await uploadFile(supabase, 'products', vFile);
          }

          variantsToInsert.push({
            product_id: newProd.id,
            name: v.name,
            price: Number(v.price) || product.price,
            image_url: vImageUrl || null,
            stock: Number(v.stock) || 0,
            is_default: v.is_default || false
          });
        }
        const { error: variantError } = await supabase.from('product_variants').insert(variantsToInsert);
        if (variantError) console.error('Error inserting variants:', variantError.message);
      }
    } catch (e) {
      console.error('Error parsing variants JSON:', e);
    }
  }

  revalidatePath('/admin/produk');
  revalidatePath('/');
  redirect('/admin/produk');
}

// === UPDATE PRODUCT ===
export async function updateProduct(id, prevState, formData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Tidak terotorisasi.' };

  // Parse data
  const imagesRaw = formData.get('images') || '';
  const tagsRaw = formData.get('tags') || '';

  // --- HANDLE GALLERY IMAGES ---
  const galleryUrls = imagesRaw.split('\n').map(s => s.trim()).filter(Boolean);
  const galleryFiles = formData.getAll('gallery_files');

  if (galleryFiles && galleryFiles.length > 0) {
    for (const file of galleryFiles) {
      if (file.size > 0) {
        const url = await uploadFile(supabase, 'products', file);
        if (url) galleryUrls.push(url);
      }
    }
  }

  const updates = {
    title: formData.get('title'),
    description: formData.get('description'),
    price: Number(formData.get('price')) || 0,
    price_grosir: Number(formData.get('price_grosir')) || null,
    category_id: formData.get('category_id') || null,
    brand: formData.get('brand') || 'ZAM Edutoys',
    images: galleryUrls,
    tags: tagsRaw.split(',').map(s => s.trim()).filter(Boolean),
    stock: Number(formData.get('stock')) || 0,
    sold: formData.get('sold') || '0',
    rating: Number(formData.get('rating')) || 5.0,
    whatsapp_msg: formData.get('whatsapp_msg'),
    is_featured: formData.get('is_featured') === 'true',
    is_active: formData.get('is_active') !== 'false',
    is_preorder: formData.get('is_preorder') === 'true',
    preorder_days: Number(formData.get('preorder_days')) || 7,
    video_url: formData.get('video_url') || null,
  };

  // --- HANDLE VIDEO UPLOAD ---
  const videoFile = formData.get('video_file');
  if (videoFile && videoFile.size > 0) {
    const vUrl = await uploadFile(supabase, 'products', videoFile);
    if (vUrl) updates.video_url = vUrl;
  }

  if (!updates.title) return { error: 'Nama produk wajib diisi.' };

  const { error: prodError } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id);

  if (prodError) return { error: prodError.message };

  // --- HANDLE VARIANTS ---
  const variantsJson = formData.get('variants_json');
  if (variantsJson) {
    try {
      const variants = JSON.parse(variantsJson);

      // Delete old variants
      await supabase.from('product_variants').delete().eq('product_id', id);

      if (variants.length > 0) {
        const variantsToInsert = [];
        for (let i = 0; i < variants.length; i++) {
          const v = variants[i];
          let vImageUrl = v.image_url;

          // Check for variant file upload
          const vFile = formData.get(`variant_file_${i}`);
          if (vFile && vFile.size > 0) {
            vImageUrl = await uploadFile(supabase, 'products', vFile);
          }

          variantsToInsert.push({
            product_id: id,
            name: v.name,
            price: Number(v.price) || updates.price,
            image_url: vImageUrl || null,
            stock: Number(v.stock) || 0,
            is_default: v.is_default || false
          });
        }
        const { error: variantError } = await supabase.from('product_variants').insert(variantsToInsert);
        if (variantError) console.error('Error updating variants:', variantError.message);
      }
    } catch (e) {
      console.error('Error parsing variants JSON:', e);
    }
  }


  revalidatePath('/admin/produk');
  revalidatePath('/');
  redirect('/admin/produk');
}

// === DELETE PRODUCT ===
export async function deleteProduct(id) {
  console.log(`[SERVER] Memulai proses penghapusan produk: ${id}`);
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    console.warn('[SERVER] Unauthorized delete attempt');
    return { error: 'Tidak terotorisasi.' };
  }

  // --- AMBIL DATA PRODUK & VARIAN UNTUK PEMBERSIHAN FILE ---
  const { data: product, error: fetchError } = await supabase
    .from('products')
    .select('images, video_url, product_variants(image_url)')
    .eq('id', id)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is 'not found'
    console.error(`[SERVER] Gagal mengambil data cleanup: ${fetchError.message}`);
  }

  if (product) {
    const urlsToDelete = [];

    // Gallery images
    if (product.images && Array.isArray(product.images)) {
      urlsToDelete.push(...product.images);
    }

    // Video URL
    if (product.video_url) {
      urlsToDelete.push(product.video_url);
    }

    // Variant images
    if (product.product_variants && Array.isArray(product.product_variants)) {
      product.product_variants.forEach(v => {
        if (v.image_url) urlsToDelete.push(v.image_url);
      });
    }

    if (urlsToDelete.length > 0) {
      console.log(`[SERVER] Ekstraksi ${urlsToDelete.length} URL untuk dihapus dari storage.`);
      await deleteFilesFromUrls(supabase, 'products', urlsToDelete);
    }
  }

  // --- HAPUS DARI DATABASE ---
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`[SERVER] Gagal menghapus baris database: ${error.message}`);
    return { error: error.message };
  }

  console.log(`[SERVER] Produk & file berhasil dihapus permanen: ${id}`);
  revalidatePath('/admin/produk');
  revalidatePath('/');
  return { success: true };
}

// === TOGGLE ACTIVE STATUS ===
export async function toggleProductActive(id, currentStatus) {
  const supabase = await createClient();
  await supabase
    .from('products')
    .update({ is_active: !currentStatus })
    .eq('id', id);

  revalidatePath('/admin/produk');
}

// === IMPORT PRODUCTS FROM EXCEL (Refactored: Variant Per Row) ===
export async function importProductsExcel(prevState, formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Tidak terotorisasi.' };

  const file = formData.get('excel_file');
  if (!file || file.size === 0) return { error: 'Harap pilih file Excel.' };

  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet);

    if (rows.length === 0) return { error: 'File Excel kosong atau format tidak sesuai.' };

    // Prefetch categories for lookup
    const { data: categories } = await supabase.from('categories').select('id, name');
    const categoryMap = {};
    categories?.forEach(cat => {
      categoryMap[cat.name.toLowerCase().trim()] = cat.id;
    });

    // 1. Group rows by Product Name
    const productGroups = {};
    rows.forEach(row => {
      const title = row['Nama Produk'];
      if (!title) return;
      if (!productGroups[title]) productGroups[title] = [];
      productGroups[title].push(row);
    });

    let successCount = 0;
    let failCount = 0;

    for (const title in productGroups) {
      try {
        const variantsInGroup = productGroups[title];
        const baseRow = variantsInGroup[0]; // Take product metadata from first row

        const categoryName = (baseRow['Kategori'] || '').toLowerCase().trim();
        const categoryId = categoryMap[categoryName] || null;

        // Collect all variant images to build the product gallery
        const galleryImages = variantsInGroup
          .map(r => r['Gambar Varian (URL)'])
          .filter(Boolean);

        const product = {
          title,
          description: baseRow['Deskripsi Produk'] || '',
          brand: baseRow['Brand'] || 'ZAM Edutoys',
          video_url: baseRow['Video URL'] || null,
          category_id: categoryId,
          tags: (baseRow['Tags (Pisah Koma)'] || '').split(',').map(s => s.trim()).filter(Boolean),
          images: galleryImages,
          price: Number(variantsInGroup[0]['Harga Varian']) || 0, // Fallback price
          stock: variantsInGroup.reduce((acc, r) => acc + (Number(r['Stok Varian']) || 0), 0),
          is_active: true,
          is_featured: false,
          is_preorder: baseRow['Pre-Order? (Y/N)']?.toUpperCase() === 'Y',
          preorder_days: Number(baseRow['Durasi Pre-Order (Hari)']) || 7,
        };

        // Insert Product
        const { data: newProd, error: prodError } = await supabase
          .from('products')
          .insert([product])
          .select()
          .single();

        if (prodError) throw new Error(prodError.message);

        // Insert Variants
        const variantsToInsert = variantsInGroup.map((r, index) => {
          const isDefault = r['Set Sebagai Default? (Y/N)']?.toUpperCase() === 'Y' || index === 0;
          return {
            product_id: newProd.id,
            name: r['Nama Varian'] || 'Default',
            price: Number(r['Harga Varian']) || product.price,
            stock: Number(r['Stok Varian']) || 0,
            image_url: r['Gambar Varian (URL)'] || null,
            is_default: isDefault
          };
        });

        // Ensure only one is default if multiple 'Y' provided
        const hasDefault = variantsToInsert.some(v => v.is_default);
        if (!hasDefault) variantsToInsert[0].is_default = true;

        const { error: variantError } = await supabase.from('product_variants').insert(variantsToInsert);
        if (variantError) throw new Error(variantError.message);

        successCount++;
      } catch (err) {
        console.error(`Import error for product "${title}":`, err);
        failCount++;
      }
    }

    revalidatePath('/admin/produk');
    revalidatePath('/');
    return { success: true, message: `${successCount} produk berhasil diimport, ${failCount} gagal.` };
  } catch (err) {
    return { error: 'Gagal memproses file: ' + err.message };
  }
}
