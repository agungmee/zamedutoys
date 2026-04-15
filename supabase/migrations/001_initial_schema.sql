-- ============================================================
-- ZAM EDUTOYS - Initial Database Schema
-- Jalankan di: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Tabel Produk
CREATE TABLE IF NOT EXISTS public.products (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  description   TEXT,
  price         NUMERIC(12, 0) NOT NULL DEFAULT 0,
  price_grosir  NUMERIC(12, 0),
  category      TEXT,
  brand         TEXT DEFAULT 'ZAM Edutoys',
  images        TEXT[] DEFAULT '{}',
  variants      TEXT[] DEFAULT '{}',
  tags          TEXT[] DEFAULT '{}',
  whatsapp_msg  TEXT,
  stock         INTEGER DEFAULT 0,
  sold          TEXT DEFAULT '0',
  rating        NUMERIC(3, 1) DEFAULT 5.0,
  is_featured   BOOLEAN DEFAULT FALSE,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Semua orang bisa baca produk yang aktif
CREATE POLICY "Public can read active products"
  ON public.products FOR SELECT
  USING (is_active = TRUE);

-- Hanya authenticated user (admin) yang bisa INSERT
CREATE POLICY "Authenticated users can insert products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (TRUE);

-- Hanya authenticated user (admin) yang bisa UPDATE
CREATE POLICY "Authenticated users can update products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- Hanya authenticated user (admin) yang bisa DELETE
CREATE POLICY "Authenticated users can delete products"
  ON public.products FOR DELETE
  TO authenticated
  USING (TRUE);

-- ============================================================
-- Sample Data (4 produk dari data.json)
-- Hapus baris ini jika tidak ingin seed data
-- ============================================================

INSERT INTO public.products (title, description, price, category, brand, images, variants, tags, stock, sold, rating, is_featured, is_active)
VALUES
  (
    '(Satuan) Papan Titian Warna Balance Beam',
    'Papan titian warna-warni untuk melatih keseimbangan dan motorik kasar anak. Terbuat dari kayu pinus halus berkualitas dan cat non-toxic water-based sehingga sangat aman bagi anak Anda.',
    42000, 'Motorik Kasar', 'ZAM Edutoys',
    ARRAY['/product/Satuan Papan Titian Warna Balance Beam.webp', '/product/Satuan Papan Titian Warna Balance Beam 2.webp'],
    ARRAY['Papan Merah', 'Papan Kuning', 'Papan Hijau', 'Papan Biru', 'Dudukan Tinggi', 'Dudukan Pendek'],
    ARRAY['Mall', 'ORI', 'PROMO XTRA', 'Pilih Lokal'],
    150, '2RB+', 4.9, FALSE, TRUE
  ),
  (
    'Balance Board Big With Anti Slip',
    'Balance Board klasik untuk melatih keseimbangan, imajinasi, dan postur anak. Dimensi: besar dan melengkung dengan ketahanan beban maksimal.',
    147600, 'Motorik Kasar', 'ZAM Edutoys',
    ARRAY['/product/Balance Board.jpeg'],
    ARRAY['With Anti-slip', 'Tanpa Anti-slip'],
    ARRAY['Mall', 'ORI', 'PROMO XTRA', 'Pilih Lokal'],
    45, '718', 4.9, TRUE, TRUE
  ),
  (
    'Double Side Balance Beam Sensory Path (Perosotan Dua Sisi)',
    'Papan perosotan dua sisi (sisi polos untuk meluncur, sisi bertekstur/sensory step untuk sensori). Dapat dipasangkan pada pikler triangle.',
    319000, 'Sensori', 'ZAM Edutoys',
    ARRAY['/product/Double Side Balance Beam Sensory Path.webp'],
    ARRAY['Natural', 'Berwarna'],
    ARRAY['Mall', 'ORI', 'PROMO XTRA', 'Pilih Lokal'],
    10, '100+', 5.0, TRUE, TRUE
  ),
  (
    'Foldable Adjustable Helper Tower',
    'Learning Tower bisa dilipat dengan tinggi yang dapat disesuaikan. Membantu si kecil mandiri di dapur atau area tinggi dengan aman.',
    450000, 'Furniture Anak', 'ZAM Edutoys',
    ARRAY['/product/Foldable Adjustable Helper Tower Learning Tower Sudah Dirakit.webp'],
    ARRAY['Sudah Dirakit', 'Belum Dirakit'],
    ARRAY['Mall', 'ORI', 'PROMO XTRA', 'Pilih Lokal'],
    5, '20', 4.8, FALSE, TRUE
  );
