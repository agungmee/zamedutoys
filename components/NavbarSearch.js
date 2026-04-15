'use client';
import { useState, useEffect, useRef } from 'react';
import { getProducts } from '@/app/actions/admin';
import ProductModal from '@/components/ProductModal';
import styles from './NavbarSearch.module.css';

// Adapter: konversi format Supabase → format yang dipakai ProductCard & Modal
function adaptProduct(p) {
  return {
    id: p.id,
    title: p.title,
    price: p.price,
    rating: p.rating,
    sold: p.sold,
    media: p.images || [],
    stock: p.stock,
    variants: p.variants || [],
    brand: p.brand,
    category: p.category,
    tags: p.tags || [],
    description: p.description,
    whatsapp_msg: p.whatsapp_msg,
    is_preorder: p.is_preorder || false,
    preorder_days: p.preorder_days || 7,
    product_variants: p.product_variants || [],
    images: p.images || [],
    categories: p.categories,
  };
}

export default function NavbarSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchDebounce = setTimeout(async () => {
      if (query.trim().length > 1) {
        setLoading(true);
        const data = await getProducts({ search: query });
        setResults(data);
        setShowDropdown(true);
        setLoading(false);
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(fetchDebounce);
  }, [query]);

  const handleSelect = (product) => {
    setSelectedProduct(adaptProduct(product));
    setShowDropdown(false);
    setQuery('');
  };

  return (
    <div className={styles.searchWrapper} ref={wrapperRef}>
      <form className={styles.searchForm} onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Cari mainan edukasi..."
          className={styles.searchInput}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if(results.length > 0) setShowDropdown(true); }}
        />
        <button type="button" className={styles.searchBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </form>

      {showDropdown && (
        <div className={styles.dropdown}>
          {loading ? (
            <div className={styles.empty}>Mencari produk...</div>
          ) : results.length > 0 ? (
            <ul className={styles.resultList}>
              {results.slice(0, 5).map(p => (
                <li key={p.id} className={styles.resultItem} onClick={() => handleSelect(p)}>
                  {p.images && p.images[0] ? (
                    <img src={p.images[0]} alt={p.title} className={styles.thumb} />
                  ) : (
                    <div className={styles.thumbPlaceholder}>📦</div>
                  )}
                  <div className={styles.info}>
                    <div className={styles.title}>{p.title}</div>
                    <div className={styles.price}>Rp {p.price.toLocaleString('id-ID')}</div>
                  </div>
                </li>
              ))}
              {results.length > 5 && (
                <li className={styles.viewAll}>
                   <a href={`/produk?search=${query}`}>Lihat semua {results.length} hasil...</a>
                </li>
              )}
            </ul>
          ) : (
            <div className={styles.empty}>Produk tidak ditemukan</div>
          )}
        </div>
      )}

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
}
