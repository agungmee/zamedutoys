import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const featured = searchParams.get('featured');
  const limit = searchParams.get('limit');

  const supabase = await createClient();

  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (category) query = query.eq('category', category);
  if (search) query = query.ilike('title', `%${search}%`);
  if (featured === 'true') query = query.eq('is_featured', true);
  if (limit) query = query.limit(parseInt(limit));

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
