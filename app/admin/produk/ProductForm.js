'use client';

import { useActionState, useState, useEffect, useRef } from 'react';
import { getCategories } from '@/app/actions/category';
import Image from 'next/image';
import styles from './form.module.css';

export default function ProductForm({ action, defaultValues }) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [categories, setCategories] = useState([]);
  const [variants, setVariants] = useState((defaultValues?.product_variants || [
    { name: 'Default', price: defaultValues?.price || 0, image_url: '', stock: defaultValues?.stock || 0, is_default: true }
  ]).map(v => ({
    ...v,
    image_url: v.image_url || ''
  })));

  const d = defaultValues || {};
  const [stockType, setStockType] = useState(d.is_preorder ? 'preorder' : 'ready');
  const [preorderDays, setPreorderDays] = useState(d.preorder_days || 7);

  // Gallery Management
  const [galleryUrls, setGalleryUrls] = useState(defaultValues?.images || []);
  const [galleryPrevFiles, setGalleryPrevFiles] = useState([]); // { file, previewUrl }
  const galleryFileInputRef = useRef(null);

  useEffect(() => {
    async function loadCategories() {
      const data = await getCategories();
      setCategories(data);
    }
    loadCategories();
  }, []);

  // --- VARIANT LOGIC ---
  const addVariant = () => {
    setVariants([...variants, { name: '', price: d.price || 0, image_url: '', stock: 0, is_default: false, preview: null }]);
  };

  const removeVariant = (index) => {
    if (variants.length <= 1) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    if (field === 'is_default' && value === true) {
      newVariants.forEach((v, i) => { if (i !== index) v.is_default = false; });
    }
    setVariants(newVariants);
  };

  const handleVariantFileChange = (index, file) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    const newVariants = [...variants];
    newVariants[index].preview = preview;
    setVariants(newVariants);
  };

  // --- GALLERY LOGIC ---
  const handleGalleryFiles = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file)
    }));
    setGalleryPrevFiles([...galleryPrevFiles, ...newFiles]);
  };

  const removeGalleryUrl = (index) => {
    setGalleryUrls(galleryUrls.filter((_, i) => i !== index));
  };

  const removeGalleryFile = (index) => {
    setGalleryPrevFiles(galleryPrevFiles.filter((_, i) => i !== index));
  };

  const handleAddUrl = () => {
    const url = prompt("Masukkan URL Gambar:");
    if (url) setGalleryUrls([...galleryUrls, url]);
  };

  return (
    <form action={formAction} className={styles.form}>
      <input type="hidden" name="variants_json" value={JSON.stringify(variants)} />
      {/* Fallback hidden input for gallery urls if we remove original textarea */}
      <input type="hidden" name="images" value={galleryUrls.join('\n')} />
      <input type="hidden" name="is_preorder" value={stockType === 'preorder'} />
      <input type="hidden" name="preorder_days" value={preorderDays} />

      <div className={styles.grid}>
        {/* Nama Produk */}
        <div className={`${styles.fieldGroup} ${styles.colFull}`}>
          <label htmlFor="prod-title" className={styles.label}>Nama Produk <span className={styles.required}>*</span></label>
          <input
            id="prod-title"
            name="title"
            type="text"
            className={styles.input}
            placeholder="Contoh: Balance Board Big With Anti Slip"
            defaultValue={d.title || ''}
            required
          />
        </div>

        {/* Deskripsi */}
        <div className={`${styles.fieldGroup} ${styles.colFull}`}>
          <label htmlFor="prod-description" className={styles.label}>Deskripsi</label>
          <textarea
            id="prod-description"
            name="description"
            className={`${styles.input} ${styles.textarea}`}
            placeholder="Jelaskan produk secara singkat..."
            defaultValue={d.description || ''}
            rows={4}
          />
        </div>

        {/* Harga & Harga Grosir */}
        <div className={styles.fieldGroup}>
          <label htmlFor="prod-price" className={styles.label}>Harga Dasar (Rp) <span className={styles.required}>*</span></label>
          <input
            id="prod-price"
            name="price"
            type="number"
            min="0"
            className={styles.input}
            placeholder="42000"
            defaultValue={d.price || ''}
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="prod-price-grosir" className={styles.label}>Harga Grosir (Rp)</label>
          <input
            id="prod-price-grosir"
            name="price_grosir"
            type="number"
            min="0"
            className={styles.input}
            placeholder="Opsional"
            defaultValue={d.price_grosir || ''}
          />
        </div>

        {/* Kategori & Brand */}
        <div className={styles.fieldGroup}>
          <label htmlFor="prod-category" className={styles.label}>Kategori</label>
          <select id="prod-category" name="category_id" className={styles.input} defaultValue={d.category_id || ''}>
            <option value="">Pilih kategori...</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="prod-brand" className={styles.label}>Brand</label>
          <input
            id="prod-brand"
            name="brand"
            type="text"
            className={styles.input}
            placeholder="ZAM Edutoys"
            defaultValue={d.brand || 'ZAM Edutoys'}
          />
        </div>

        {/* Gallery Gambar Produk - REAMPED */}
        <div className={`${styles.fieldGroup} ${styles.colFull}`}>
          <div className={styles.sectionHeader}>
            <label className={styles.label}>Gallery Gambar Produk</label>
            <div className={styles.headerActions}>
              <button type="button" onClick={() => galleryFileInputRef.current.click()} className={styles.addBtn}>+ Upload File</button>
              <button type="button" onClick={handleAddUrl} className={styles.addBtnSecondary}>+ Tambah URL</button>
              <input
                type="file"
                multiple
                name="gallery_files"
                ref={galleryFileInputRef}
                onChange={handleGalleryFiles}
                style={{ display: 'none' }}
                accept="image/*"
              />
            </div>
          </div>

          <div className={styles.galleryGrid}>
            {/* Existing URLs */}
            {galleryUrls.map((url, i) => (
              <div key={`url-${i}`} className={styles.galleryItem}>
                <Image src={url} alt="Gallery" fill className={styles.galleryImg} />
                <button type="button" onClick={() => removeGalleryUrl(i)} className={styles.removeImgBtn}>&times;</button>
                <div className={styles.itemBadge}>URL</div>
              </div>
            ))}

            {/* New File Previews */}
            {galleryPrevFiles.map((item, i) => (
              <div key={`file-${i}`} className={styles.galleryItem}>
                <Image src={item.previewUrl} alt="Preview" fill className={styles.galleryImg} />
                <button type="button" onClick={() => removeGalleryFile(i)} className={styles.removeImgBtn}>&times;</button>
                <div className={`${styles.itemBadge} ${styles.badgeNew}`}>NEW FILE</div>
                {/* Submit the actual file */}
                <input type="file" name="gallery_files" style={{ display: 'none' }} />
              </div>
            ))}

            {galleryUrls.length === 0 && galleryPrevFiles.length === 0 && (
              <div className={styles.emptyGallery} onClick={() => galleryFileInputRef.current.click()}>
                <span>Klik untuk tambah gambar</span>
              </div>
            )}
          </div>
        </div>

        {/* Varian - UPDATED FOR UPLOAD */}
        <div className={`${styles.fieldGroup} ${styles.colFull}`}>
          <div className={styles.sectionHeader}>
            <label className={styles.label}>Variasi Produk</label>
            <button type="button" onClick={addVariant} className={styles.addBtn}>+ Tambah Varian</button>
          </div>
          <div className={styles.variantList}>
            {variants.map((v, i) => (
              <div key={i} className={styles.variantRow}>
                <div className={styles.rowTop}>
                  <div className={styles.vImageCol}>
                    <div className={styles.vImageWrapper} onClick={() => document.getElementById(`vfile-${i}`).click()}>
                      {v.preview || v.image_url ? (
                        <Image src={v.preview || v.image_url} alt="V" fill className={styles.vImg} />
                      ) : (
                        <div className={styles.vImgPlaceholder}>+</div>
                      )}
                    </div>
                    <input
                      type="file"
                      id={`vfile-${i}`}
                      name={`variant_file_${i}`}
                      style={{ display: 'none' }}
                      accept="image/*"
                      onChange={(e) => handleVariantFileChange(i, e.target.files[0])}
                    />
                  </div>
                  <div className={styles.vInfoCol}>
                    <div className={styles.vInputs}>
                      <input
                        type="text"
                        placeholder="Nama (e.g. Merah)"
                        value={v.name}
                        onChange={e => updateVariant(i, 'name', e.target.value)}
                        className={styles.inputSmall}
                        required
                      />
                      <input
                        type="number"
                        placeholder="Harga"
                        value={v.price}
                        onChange={e => updateVariant(i, 'price', e.target.value)}
                        className={styles.inputSmall}
                      />
                      <input
                        type="number"
                        placeholder="Stok"
                        value={v.stock}
                        onChange={e => updateVariant(i, 'stock', e.target.value)}
                        className={styles.inputSmall}
                      />
                    </div>
                    <div className={styles.vUrlRow}>
                      <input
                        type="text"
                        placeholder="Atau Paste URL Gambar Varian"
                        value={v.image_url}
                        onChange={e => updateVariant(i, 'image_url', e.target.value)}
                        className={styles.inputFull}
                      />
                      <label className={styles.checkWrap}>
                        <input
                          type="checkbox"
                          checked={v.is_default}
                          onChange={e => updateVariant(i, 'is_default', e.target.checked)}
                        />
                        <span>Default</span>
                      </label>
                      <button type="button" onClick={() => removeVariant(i)} className={styles.delBtn}>&times;</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Produk - NEW */}
        <div className={`${styles.fieldGroup} ${styles.colFull}`}>
          <label className={styles.label}>Video Produk (Opsional)</label>
          <div className={styles.videoUploadArea}>
            <div className={styles.vInputs}>
              <button
                type="button"
                className={styles.addBtnSecondary}
                onClick={() => document.getElementById('prod-video-file').click()}
              >
                + Upload Video (.mp4)
              </button>
              <input
                id="prod-video-file"
                type="file"
                name="video_file"
                accept="video/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files[0]) {
                    const vUrl = URL.createObjectURL(e.target.files[0]);
                    document.getElementById('video-preview-player').src = vUrl;
                    document.getElementById('video-preview-container').style.display = 'block';
                  }
                }}
              />
              <input
                name="video_url"
                type="text"
                className={styles.input}
                placeholder="Atau masukkan link video (.mp4)"
                defaultValue={d.video_url || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val) {
                    document.getElementById('video-preview-player').src = val;
                    document.getElementById('video-preview-container').style.display = 'block';
                  } else {
                    document.getElementById('video-preview-container').style.display = 'none';
                  }
                }}
              />
            </div>
            <div id="video-preview-container" className={styles.videoPreview} style={{ display: d.video_url ? 'block' : 'none' }}>
              <video id="video-preview-player" src={d.video_url} controls className={styles.previewPlayer} />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className={`${styles.fieldGroup} ${styles.colFull}`}>
          <label htmlFor="prod-tags" className={styles.label}>Tags (Pisahkan dengan koma)</label>
          <input
            id="prod-tags"
            name="tags"
            type="text"
            className={styles.input}
            placeholder="Mall, ORI, PROMO XTRA"
            defaultValue={(d.tags || []).join(', ')}
          />
        </div>

        {/* Checkboxes */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Tipe Stok</label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="stock_type"
                value="ready"
                checked={stockType === 'ready'}
                onChange={() => setStockType('ready')}
              />
              <span>Ready Stock</span>
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="stock_type"
                value="preorder"
                checked={stockType === 'preorder'}
                onChange={() => setStockType('preorder')}
              />
              <span>Pre-Order</span>
            </label>
          </div>
        </div>

        {stockType === 'preorder' && (
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Durasi Pre-Order (Hari)</label>
            <input
              type="number"
              name="preorder_days"
              min="1"
              className={styles.input}
              value={preorderDays}
              onChange={(e) => setPreorderDays(Number(e.target.value))}
            />
          </div>
        )}

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Produk Unggulan</label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input type="radio" name="is_featured" value="true" defaultChecked={d.is_featured === true} />
              <span>Ya (Tampil di Terlaris)</span>
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="is_featured" value="false" defaultChecked={d.is_featured !== true} />
              <span>Tidak</span>
            </label>
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Status Produk</label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input type="radio" name="is_active" value="true" defaultChecked={d.is_active !== false} />
              <span>Aktif</span>
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="is_active" value="false" defaultChecked={d.is_active === false} />
              <span>Nonaktif</span>
            </label>
          </div>
        </div>
      </div>

      {/* Error */}
      {state?.error && (
        <div className={styles.errorAlert}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {state.error}
        </div>
      )}

      <div className={styles.formActions}>
        <a href="/admin/produk" className={styles.cancelBtn}>Batal</a>
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={pending}
        >
          {pending ? 'Menyimpan...' : (defaultValues ? 'Simpan Perubahan' : 'Tambah Produk')}
        </button>
      </div>
    </form>
  );
}
