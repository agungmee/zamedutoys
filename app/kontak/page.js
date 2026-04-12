import React from 'react';
import styles from './Kontak.module.css';

export default function KontakPage() {
  const contactLinks = [
    { name: 'WhatsApp', value: '0812-3456-7890', icon: 'fa-brands fa-whatsapp', color: '#25D366', href: 'https://wa.me/6281234567890' },
    { name: 'Email', value: 'halo@zamedutoys.com', icon: 'fa-solid fa-envelope', color: '#EA4335', href: 'mailto:halo@zamedutoys.com' },
    { name: 'Instagram', value: '@zamedutoys', icon: 'fa-brands fa-instagram', color: '#E4405F', href: 'https://instagram.com/zamedutoys' },
    { name: 'Website Utama', value: 'www.zamedutoys.com', icon: 'fa-solid fa-globe', color: '#4285F4', href: 'https://www.zamedutoys.com' },
  ];

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Hubungi Kami</h1>
          <p className={styles.subtitle}>Ada pertanyaan atau butuh bantuan? Tim kami siap melayani Anda dengan sepenuh hati.</p>
        </div>

        <div className={styles.contactGrid}>
          {contactLinks.map((contact) => (
            <a key={contact.name} href={contact.href} target="_blank" rel="noopener noreferrer" className={styles.contactCard}>
              <div className={styles.iconBox} style={{ backgroundColor: `${contact.color}10`, color: contact.color }}>
                <i className={contact.icon}></i>
              </div>
              <div className={styles.info}>
                <span className={styles.label}>{contact.name}</span>
                <span className={styles.value}>{contact.value}</span>
              </div>
            </a>
          ))}
        </div>

        <div className={styles.addressBox}>
          <div className={styles.addressContent}>
            <div className={styles.addressIcon}>📍</div>
            <div>
              <h3 className={styles.addressTitle}>Workshop & Office</h3>
              <p className={styles.addressText}>
                JL. Edutoys No. 123, Kelurahan Bermain, <br />
                Kecamatan Belajar, Kota Edukasi, Indonesia
              </p>
            </div>
          </div>
          <div className={styles.mapMock}>
            <span>Lihat di Google Maps →</span>
          </div>
        </div>
      </div>
    </main>
  );
}
