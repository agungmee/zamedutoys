'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { uploadFile } from '@/lib/storage';

export async function getBanners(onlyActive = true) {
  const supabase = await createClient();
  let query = supabase.from('banners').select('*').order('display_order', { ascending: true });
  
  if (onlyActive) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;
  if (error) {
    console.error('getBanners error:', error.message);
    return [];
  }
  return data || [];
}

// uploadBannerImage moved to lib/storage.js

export async function createBanner(prevState, formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Tidak terotorisasi.' };

  try {
    const bannerFile = formData.get('banner_file');
    let imageUrl = formData.get('image_url'); // Fallback to URL if file empty

    // Jika ada file, upload dan gunakan URL-nya
    if (bannerFile && bannerFile.size > 0) {
      imageUrl = await uploadFile(supabase, 'banners', bannerFile);
    }

    if (!imageUrl) return { error: 'Harap unggah file atau masukkan link gambar.' };

    const banner = {
      image_url: imageUrl,
      title: formData.get('title'),
      subtitle: formData.get('subtitle'),
      link_url: formData.get('link_url'),
      display_order: Number(formData.get('display_order')) || 0,
      is_active: formData.get('is_active') === 'true'
    };

    const { error } = await supabase.from('banners').insert([banner]);
    if (error) return { error: error.message };

    revalidatePath('/');
    revalidatePath('/admin/banner');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function updateBanner(id, prevState, formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Tidak terotorisasi.' };

  try {
    const bannerFile = formData.get('banner_file');
    let imageUrl = formData.get('image_url');

    if (bannerFile && bannerFile.size > 0) {
      imageUrl = await uploadFile(supabase, 'banners', bannerFile);
    }

    if (!imageUrl) return { error: 'Harap unggah file atau masukkan link gambar.' };

    const updates = {
      image_url: imageUrl,
      title: formData.get('title'),
      subtitle: formData.get('subtitle'),
      link_url: formData.get('link_url'),
      display_order: Number(formData.get('display_order')) || 0,
      is_active: formData.get('is_active') === 'true'
    };

    const { error } = await supabase.from('banners').update(updates).eq('id', id);
    if (error) return { error: error.message };

    revalidatePath('/');
    revalidatePath('/admin/banner');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function deleteBanner(id) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Tidak terotorisasi.' };

  // Optional: Delete physical file from storage if it's a supabase URL
  // (Left as enhancement since product deletion also usually marks as inactive first)

  const { error } = await supabase.from('banners').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/banner');
  return { success: true };
}

export async function toggleBannerActive(id, currentStatus) {
  const supabase = await createClient();
  await supabase.from('banners').update({ is_active: !currentStatus }).eq('id', id);
  revalidatePath('/');
  revalidatePath('/admin/banner');
}
