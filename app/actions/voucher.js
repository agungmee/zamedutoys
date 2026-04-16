'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getVouchers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('vouchers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching vouchers:', error);
    return [];
  }
  return data;
}

export async function createVoucher(formData) {
  const supabase = await createClient();
  
  const voucher = {
    code: formData.get('code').toUpperCase(),
    discount_type: formData.get('discount_type'),
    discount_value: parseInt(formData.get('discount_value')),
    min_purchase: parseInt(formData.get('min_purchase') || 0),
    quota: parseInt(formData.get('quota') || 999),
    used_count: 0,
    is_active: formData.get('is_active') === 'true',
    expires_at: formData.get('expires_at') || null,
  };

  const { data, error } = await supabase.from('vouchers').insert([voucher]);

  if (error) {
    console.error('Error creating voucher:', error);
    return { error: error.message };
  }

  revalidatePath('/admin/voucher');
  return { success: true };
}

export async function updateVoucher(id, formData) {
  const supabase = await createClient();
  
  const voucher = {
    code: formData.get('code').toUpperCase(),
    discount_type: formData.get('discount_type'),
    discount_value: parseInt(formData.get('discount_value')),
    min_purchase: parseInt(formData.get('min_purchase') || 0),
    quota: parseInt(formData.get('quota') || 999),
    is_active: formData.get('is_active') === 'true',
    expires_at: formData.get('expires_at') || null,
  };

  const { data, error } = await supabase
    .from('vouchers')
    .update(voucher)
    .eq('id', id);

  if (error) {
    console.error('Error updating voucher:', error);
    return { error: error.message };
  }

  revalidatePath('/admin/voucher');
  return { success: true };
}

export async function deleteVoucher(id) {
  const supabase = await createClient();
  const { error } = await supabase.from('vouchers').delete().eq('id', id);

  if (error) {
    console.error('Error deleting voucher:', error);
    return { error: error.message };
  }

  revalidatePath('/admin/voucher');
  return { success: true };
}

export async function validateVoucher(code, totalAmount) {
  const supabase = await createClient();
  
  const { data: voucher, error } = await supabase
    .from('vouchers')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single();

  if (error || !voucher) {
    return { error: 'Kode voucher tidak valid atau sudah tidak aktif.' };
  }

  // Check quota
  if (voucher.quota !== null && voucher.used_count >= voucher.quota) {
    return { error: 'Kuota voucher sudah habis.' };
  }

  // Check expiration
  if (voucher.expires_at && new Date(voucher.expires_at) < new Date()) {
    return { error: 'Voucher sudah kedaluwarsa.' };
  }

  // Check min purchase
  if (totalAmount < voucher.min_purchase) {
    const minNeeded = voucher.min_purchase - totalAmount;
    return { 
      error: `Minimal pembelian Rp ${voucher.min_purchase.toLocaleString('id-ID')} belum tercapai. Kurang Rp ${minNeeded.toLocaleString('id-ID')} lagi.` 
    };
  }

  return { success: true, voucher };
}
