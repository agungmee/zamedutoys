-- ============================================================
-- ZAM EDUTOYS - Storage Buckets Migration
-- Jalankan di: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Buat bucket 'banners' jika belum ada
-- Catatan: Supabase Storage API mengharuskan penggunaan fungsi khusus jika lewat SQL
-- Namun cara termudah adalah lewat Dashboard UI. 
-- SQL di bawah ini mencoba mendaftarkan bucket ke tabel storage.

-- 1. Buat buckets jika belum ada
INSERT INTO storage.buckets (id, name, public)
VALUES ('banners', 'banners', true), ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Kebijakan akses (Policies) untuk Storage
-- Izinkan akses baca publik
CREATE POLICY "Public Access Banners" ON storage.objects FOR SELECT USING ( bucket_id = 'banners' );
CREATE POLICY "Public Access Products" ON storage.objects FOR SELECT USING ( bucket_id = 'products' );

-- Izinkan user terautentikasi (Admin) untuk upload
CREATE POLICY "Admin Upload Banners" ON storage.objects FOR INSERT TO authenticated WITH CHECK ( bucket_id = 'banners' );
CREATE POLICY "Admin Upload Products" ON storage.objects FOR INSERT TO authenticated WITH CHECK ( bucket_id = 'products' );

-- Izinkan Admin untuk update/delete
CREATE POLICY "Admin Update Banners" ON storage.objects FOR UPDATE TO authenticated USING ( bucket_id = 'banners' );
CREATE POLICY "Admin Update Products" ON storage.objects FOR UPDATE TO authenticated USING ( bucket_id = 'products' );

CREATE POLICY "Admin Delete Banners" ON storage.objects FOR DELETE TO authenticated USING ( bucket_id = 'banners' );
CREATE POLICY "Admin Delete Products" ON storage.objects FOR DELETE TO authenticated USING ( bucket_id = 'products' );

