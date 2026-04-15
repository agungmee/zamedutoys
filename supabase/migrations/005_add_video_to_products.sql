-- ============================================================
-- ZAM EDUTOYS - Add Video Support to Products
-- Jalankan di: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Tambahkan kolom video_url ke tabel products
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Deskripsi kolom untuk dokumentasi
COMMENT ON COLUMN public.products.video_url IS 'URL video produk (bisa link YouTube atau path ke file di storage)';
