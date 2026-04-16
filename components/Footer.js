import React from 'react';
import styles from './Footer.module.css';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brandSide}>
            <Image src="/logo.png" alt="ZAM EDUTOYS Logo" width={280} height={84} className={styles.logo} />
            <p className={styles.tagline}>Membangun Masa Depan Melalui Bermain.</p>
            <div className={styles.socials}>
              <a href="#" className={styles.socialLink} aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" className={styles.socialLink} aria-label="Facebook">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" className={styles.socialLink} aria-label="TikTok">
                <i className="fa-brands fa-tiktok"></i>
              </a>
              <a href="#" className={styles.socialLink} aria-label="WhatsApp">
                <i className="fa-brands fa-whatsapp"></i>
              </a>
            </div>
          </div>
          
          <div className={styles.linksSide}>
            <div className={styles.linkGroup}>
              <h5 className={styles.groupTitle}>Menu Utama</h5>
              <Link href="/" className={styles.link}>Beranda</Link>
              <Link href="/produk" className={styles.link}>Produk Kami</Link>
              <Link href="/grosir" className={styles.link}>Beli Grosir</Link>
            </div>
            
            <div className={styles.linkGroup}>
              <h5 className={styles.groupTitle}>Bantuan</h5>
              <Link href="/cara-pesan" className={styles.link}>Cara Pesan</Link>
              <Link href="/garansi" className={styles.link}>Garansi & Layanan</Link>
            </div>

            <div className={styles.linkGroup}>
              <h5 className={styles.groupTitle}>Alamat</h5>
              <p className={styles.addressText}>
                Jl. Tegalsari No.073 RT26/RW14<br />
                Dompyongan, Jogonalan, Klaten
              </p>
              <a 
                href="https://maps.app.goo.gl/vD5LNQV2n6aXxDM98?g_st=ac" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.mapLink}
              >
                <i className="fa-solid fa-location-dot"></i> Lihat di Google Maps
              </a>
            </div>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {currentYear} <strong>ZAM EDUTOYS</strong>. All Rights Reserved.
          </p>
          <p className={styles.signature}>Built with ❤️ for Indonesian Kids</p>
        </div>
      </div>
    </footer>
  );
}
