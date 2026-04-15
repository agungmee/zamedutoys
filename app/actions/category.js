'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('getCategories error:', error.message);
    return [];
  }
  return data || [];
}

export async function createCategory(prevState, formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Tidak terotorisasi.' };

  const name = formData.get('name');
  const slug = formData.get('slug') || name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  const image_url = formData.get('image_url');
  const description = formData.get('description');

  if (!name) return { error: 'Nama kategori wajib diisi.' };

  const { error } = await supabase.from('categories').insert([{
    name,
    slug,
    image_url,
    description
  }]);

  if (error) return { error: error.message };

  revalidatePath('/admin/kategori');
  return { success: true };
}

export async function updateCategory(id, prevState, formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Tidak terotorisasi.' };

  const name = formData.get('name');
  const slug = formData.get('slug');
  const image_url = formData.get('image_url');
  const description = formData.get('description');

  if (!name) return { error: 'Nama kategori wajib diisi.' };

  const { error } = await supabase
    .from('categories')
    .update({ name, slug, image_url, description })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/kategori');
  return { success: true };
}

export async function deleteCategory(id) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Tidak terotorisasi.' };

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/kategori');
  return { success: true };
}
