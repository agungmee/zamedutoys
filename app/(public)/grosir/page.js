import React from 'react';
import Link from 'next/link';
import styles from './Grosir.module.css';

export const metadata = {
  title: 'Mitra & Grosir',
  description: 'Dapatkan penawaran harga grosir dari ZAM Edutoys. Beli mainan edukasi murah, berkualitas.',
  openGraph: {
    title: 'Grosir Mainan Edukasi | ZAM Edutoys',
    description: 'Peluang bisnis dengan penawaran grosir dan reseller dari ZAM Edutoys.',
  }
};

export default function GrosirPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.hero}>
          <div className={styles.tagWrapper}>
            <span className={styles.tag}>Peluang Bisnis</span>
          </div>
          <h1 className={styles.title}>Program Beli Grosir & Reseller</h1>
          <p className={styles.description}>
            Dapatkan harga spesial dan dukungan penuh untuk Anda yang ingin bermitra dengan ZAM EDUTOYS. 
            Kami membuka peluang bagi sekolah, toko mainan, dan perorangan untuk menjadi mitra kami.
          </p>
        </div>

        <div className={styles.benefitsGrid}>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>💰</div>
            <h3 className={styles.benefitTitle}>Harga Kompetitif</h3>
            <p className={styles.benefitText}>Potongan harga signifikan untuk pembelian jumlah besar atau rutin.</p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>📦</div>
            <h3 className={styles.benefitTitle}>Prioritas Stok</h3>
            <p className={styles.benefitText}>Mitra grosir mendapatkan prioritas utama dalam alokasi stok produk terbaru.</p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>🤝</div>
            <h3 className={styles.benefitTitle}>Dukungan Penuh</h3>
            <p className={styles.benefitText}>Kami menyediakan materi promosi dan konsultasi pengembangan bisnis.</p>
          </div>
        </div>

        <div className={styles.ctaBox}>
          <h2 className={styles.ctaTitle}>Siap Menjadi Mitra Kami?</h2>
          <p className={styles.ctaText}>
            Silakan hubungi tim sales kami untuk mendapatkan katalog harga grosir dan syarat kerja sama.
          </p>
          <div className={styles.ctaButtons}>
            <a href="https://wa.me/628995366864?text=Halo%20ZAM%20EDUTOYS,%20saya%20tertarik%20dengan%20program%20Beli%20Grosir." target="_blank" rel="noopener noreferrer" className={styles.waBtn}>
              <i className="fa-brands fa-whatsapp"></i> Chat Sales di WhatsApp
            </a>
            <Link href="/kontak" className={styles.kontakBtn}>
              Lihat Kontak Lainnya
            </Link>
          </div>
        </div>

        <div className={styles.terms}>
          <h4 className={styles.termsTitle}>Syarat Umum:</h4>
          <ul className={styles.termsList}>
            <li>Minimal pembelian untuk kategori grosir adalah 10 pcs (boleh campur).</li>
            <li>Status reseller aktif setelah pembelian pertama dilakukan.</li>
            <li>Pemesanan dilakukan melalui tim sales resmi ZAM EDUTOYS.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
