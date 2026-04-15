-- ============================================================
-- ZAM EDUTOYS - Banner Management Migration
-- Jalankan di: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Tabel Banner
CREATE TABLE IF NOT EXISTS public.banners (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url     TEXT NOT NULL,
  title         TEXT,
  subtitle      TEXT,
  link_url      TEXT,
  display_order INTEGER DEFAULT 0,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Aktifkan RLS untuk banner
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active banners" ON public.banners FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admin can full access banners" ON public.banners TO authenticated USING (true) WITH CHECK (true);

-- Isi banner awal (menggunakan aset yang sudah ada)
INSERT INTO public.banners (image_url, title, display_order)
VALUES 
  ('/slide_1.png', 'Wooden Blocks Collection', 1),
  ('/slide_2.png', 'Science & Discovery Kits', 2),
  ('/slide_3.png', 'Montessori Puzzles', 3)
ON CONFLICT DO NOTHING;

-- Indeks untuk urutan tampil
CREATE INDEX IF NOT EXISTS idx_banners_order ON public.banners(display_order);
