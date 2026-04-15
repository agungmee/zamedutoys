/**
 * Shared storage utility for Supabase
 */

export async function uploadFile(supabase, bucket, file) {
  if (!file || file.size === 0) return null;

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`; // Simpan langsung di root bucket atau folder tertentu

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error(`Upload error to ${bucket}:`, error.message);
    throw new Error(`Gagal mengunggah gambar ke ${bucket}: ` + error.message);
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function deleteFilesFromUrls(supabase, bucket, urls) {
  if (!urls || !Array.isArray(urls) || urls.length === 0) return;

  // Bersihkan urls dari nilai kosong dan non-string
  const validUrls = urls.filter(u => u && typeof u === 'string');
  
  const pathsToDelete = validUrls
    .map(url => {
      // Cari marker '/public/[bucket]/' untuk mengekstrak path filenya
      const bucketMarker = `/public/${bucket}/`;
      const index = url.indexOf(bucketMarker);
      if (index !== -1) {
        return url.substring(index + bucketMarker.length);
      }
      return null;
    })
    .filter(Boolean);

  if (pathsToDelete.length > 0) {
    console.log(`[STORAGE] Menghapus ${pathsToDelete.length} file dari bucket "${bucket}":`, pathsToDelete);
    const { error } = await supabase.storage.from(bucket).remove(pathsToDelete);
    if (error) {
      console.error(`[STORAGE] Error saat menghapus file dari ${bucket}:`, error.message);
    } else {
      console.log(`[STORAGE] Berhasil menghapus file fisik.`);
    }
  }
}
