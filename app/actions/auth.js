'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function login(prevState, formData) {
  const supabase = await createClient();

  const credentials = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  if (!credentials.email || !credentials.password) {
    return { error: 'Email dan password wajib diisi.' };
  }

  const { error } = await supabase.auth.signInWithPassword(credentials);

  if (error) {
    return { error: 'Email atau password salah. Coba lagi.' };
  }

  redirect('/admin');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
