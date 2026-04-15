-- ============================================================
-- ZAM EDUTOYS - Categories & Complex Variants Migration
-- Jalankan di: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Tabel Kategori
CREATE TABLE IF NOT EXISTS public.categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  image_url   TEXT,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Aktifkan RLS untuk kategori
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin can full access categories" ON public.categories TO authenticated USING (true) WITH CHECK (true);

-- Isi kategori awal
INSERT INTO public.categories (name, slug)
VALUES 
  ('Motorik Kasar', 'motorik-kasar'),
  ('Motorik Halus', 'motorik-halus'),
  ('Sensori', 'sensori'),
  ('Kognitif', 'kognitif'),
  ('Bahasa', 'bahasa'),
  ('Sosial Emosional', 'sosial-emosional'),
  ('Furniture Anak', 'furniture-anak'),
  ('Lainnya', 'lainnya')
ON CONFLICT (slug) DO NOTHING;

-- 2. Update Tabel Produk (Link ke Kategori)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id);

-- Migrasi data kategori yang sudah ada (teks ke ID)
UPDATE public.products p
SET category_id = c.id
FROM public.categories c
WHERE p.category = c.name;

-- 3. Tabel Varian Produk
CREATE TABLE IF NOT EXISTS public.product_variants (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  price       NUMERIC(12, 0) NOT NULL,
  image_url   TEXT,
  stock       INTEGER DEFAULT 0,
  is_default  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Aktifkan RLS untuk varian
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read variants" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Admin can full access variants" ON public.product_variants TO authenticated USING (true) WITH CHECK (true);

-- 4. Migrasi Varian Sederhana (Opsional, memindahkan data dari array ke tabel baru)
-- Kita akan melakukan ini lewat kode atau secara manual di dashboard admin setelah update.

-- Indeks untuk performa
CREATE INDEX IF NOT EXISTS idx_variants_product_id ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
