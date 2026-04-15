import { getAllProductsAdmin } from '@/app/actions/admin';
import styles from './dashboard.module.css';

export const metadata = {
  title: 'Dashboard — ZAM Edutoys Admin',
};

export default async function AdminDashboard() {
  const products = await getAllProductsAdmin().catch(() => []);

  const total = products.length;
  const active = products.filter(p => p.is_active).length;
  const featured = products.filter(p => p.is_featured).length;
  const lowStock = products.filter(p => p.stock <= 5 && p.is_active).length;

  const stats = [
    {
      label: 'Total Produk',
      value: total,
      icon: '📦',
      color: '#6366f1',
      bg: 'rgba(99, 102, 241, 0.1)',
    },
    {
      label: 'Produk Aktif',
      value: active,
      icon: '✅',
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.1)',
    },
    {
      label: 'Produk Unggulan',
      value: featured,
      icon: '⭐',
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.1)',
    },
    {
      label: 'Stok Menipis (≤5)',
      value: lowStock,
      icon: '⚠️',
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.1)',
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Selamat datang di panel admin ZAM Edutoys</p>
        </div>
        <a href="/admin/produk/tambah" className={styles.addBtn}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Tambah Produk
        </a>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.statCard} style={{ '--accent': stat.color, '--bg': stat.bg }}>
            <div className={styles.statIcon}>{stat.icon}</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Aksi Cepat</h2>
        <div className={styles.quickActions}>
          <a href="/admin/produk" className={styles.actionCard}>
            <span className={styles.actionIcon}>📋</span>
            <span>Kelola Produk</span>
          </a>
          <a href="/admin/produk/tambah" className={styles.actionCard}>
            <span className={styles.actionIcon}>➕</span>
            <span>Tambah Produk</span>
          </a>
          <a href="/" target="_blank" className={styles.actionCard}>
            <span className={styles.actionIcon}>🌐</span>
            <span>Lihat Website</span>
          </a>
        </div>
      </div>

      {/* Recent Products */}
      {products.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Produk Terbaru</h2>
          <div className={styles.recentList}>
            {products.slice(0, 5).map(product => (
              <div key={product.id} className={styles.recentItem}>
                <div className={styles.recentImg}>
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.title} />
                  ) : (
                    <span>📦</span>
                  )}
                </div>
                <div className={styles.recentInfo}>
                  <span className={styles.recentName}>{product.title}</span>
                  <span className={styles.recentMeta}>{product.category} · Stok: {product.stock}</span>
                </div>
                <div className={styles.recentPrice}>
                  Rp {Number(product.price).toLocaleString('id-ID')}
                </div>
                <span className={`${styles.badge} ${product.is_active ? styles.badgeActive : styles.badgeInactive}`}>
                  {product.is_active ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
