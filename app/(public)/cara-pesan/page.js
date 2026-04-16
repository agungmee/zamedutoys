"use client";
import React from 'react';
import styles from './CaraPesan.module.css';
import PaymentSection from "@/components/PaymentSection";

export default function CaraPesanPage() {
  const webSteps = [
    "Silakan pilih produk yang ingin Anda beli dari katalog kami.",
    "Klik tombol 'Pesan via WhatsApp' atau 'Detail' pada tiap-tiap produk.",
    "Beri tahu Admin jumlah (quantity) atau varian yang diinginkan melalui chat.",
    "Admin akan mengirimkan rincian pesanan beserta total biaya termasuk ongkos kirim.",
    "Lakukan pembayaran sesuai instruksi pembayaran yang diberikan oleh Admin.",
    "Kirimkan bukti transfer kepada Admin untuk mempercepat proses verifikasi.",
    "Setelah pembayaran terverifikasi, pesanan Anda akan segera diproses dan dikirim.",
    "Silakan tunggu barang pesanan Anda sampai dengan selamat di rumah."
  ];

  const paymentMethods = [
    { name: "BCA", number: "167-xxxx-xxx", owner: "ZAM Edutoys" },
    { name: "BSI", number: "717-xxxx-xxx", owner: "ZAM Edutoys" },
    { name: "QRIS", number: "Scan di Kasir/WhatsApp", owner: "ZAM Edutoys" },
    { name: "DANA", number: "0899-5366-864", owner: "ZAM Edutoys" },
    { name: "SHOPEEPAY", number: "0899-5366-864", owner: "ZAM Edutoys" }
  ];

  const procurements = [
    "Pesanan khusus dalam jumlah banyak",
    "Proyek pengadaan mainan edukatif untuk PG, PAUD, TK, dll",
    "Pembuatan souvenir perusahaan berbahan kayu",
    "Pesanan desain kustom (min. order 30pcs/item)"
  ];

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.hero}>
          <div className={styles.tagWrapper}>
            <span className={styles.tag}>Panduan Belanja</span>
          </div>
          <h1 className={styles.title}>Cara Order & Pembayaran</h1>
          <p className={styles.description}>
            Demi kenyamanan Anda, ZAM Edutoys menyediakan beberapa pilihan cara pemesanan yang mudah, aman, dan terpercaya.
          </p>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Metode Pemesanan</h2>
          <div className={styles.methodGrid}>
            <div className={styles.methodCard}>
              <h3>Via WhatsApp (Direkomendasikan)</h3>
              <p>Metode tercepat untuk konsultasi produk, cek ongkos kirim, dan pemesanan langsung melalui Admin kami.</p>
              <a href="https://wa.me/628995366864" target="_blank" rel="noopener noreferrer" className={styles.waBtn}>
                Chat Admin Sekarang
              </a>
            </div>
            <div className={styles.methodCard}>
              <h3>Via Website ZAM Edutoys</h3>
              <p>Lihat ratusan koleksi mainan edukatif kayu kami langsung dari browser Anda kapan saja dan di mana saja.</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Langkah Pembelian melalui Web</h2>
          <div className={styles.stepList}>
            <ul>
              {webSteps.map((step, i) => (
                <li key={i} className={styles.stepListItem}>
                  <div className={styles.dot}></div>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Informasi Pembayaran</h2>
          <PaymentSection showHeader={false} showFooter={false} isSection={false} />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Layanan Pengadaan & Grosir</h2>
          <div className={styles.procurementBox}>
            <p style={{ color: '#475569', marginBottom: '1.5rem', fontWeight: 500 }}>
              ZAM Edutoys juga melayani berbagai kebutuhan skala besar dan institusional:
            </p>
            <div className={styles.procurementList}>
              {procurements.map((item, i) => (
                <div key={i} className={styles.procurementItem}>
                  <span className={styles.checkIcon}>✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className={styles.footerNote}>
          ZAM EDUTOYS — KEPUASAN ANDA ADALAH PRIORITAS KAMI
        </div>
      </div>
    </main>
  );
}
