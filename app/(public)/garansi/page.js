"use client";
import React, { useState } from 'react';
import styles from './Garansi.module.css';

const AccordionItem = ({ title, children, isOpen, onClick }) => (
  <div className={styles.accordion}>
    <button className={styles.accordionHeader} onClick={onClick}>
      <h2>{title}</h2>
      <svg 
        className={`${styles.chevron} ${isOpen ? styles.chevronActive : ''}`} 
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>
    {isOpen && (
      <div className={styles.accordionContent}>
        {children}
      </div>
    )}
  </div>
);

export default function GaransiPage() {
  const [openSection, setOpenSection] = useState('penting');

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const importantPoints = [
    { num: 1, text: <>Produk <b>BELUM DIRAKIT</b>. Perakitan dilakukan oleh customer.</> },
    { num: 2, text: <>Saat sampai, <b>CEK & PASTIKAN</b> nama, warna, dan kode produk sudah sesuai.</> },
    { num: 3, text: <>Jika sudah sesuai pesanan, silakan buka.</> },
    { num: 4, text: <>Jika tidak sesuai pesanan, jangan buka dan rakit. <b>SEGERA hubungi CS</b>. <span className={styles.highlightedText}>JANGAN LUPA REKAM PROSES UNBOXING</span> untuk bukti komplain.</> },
    { num: 5, text: <>Pastikan tidak ada bagian furnitur yang cacat/rusak.</> },
    { num: 6, text: <>Jika ada yang cacat/rusak, <b>SEGERA hubungi CS</b>.</> },
    { num: 7, text: <>Paket sudah termasuk buku panduan pemasangan.</> },
    { num: 8, text: <>Pesanan terverifikasi diproses ± 2 hari kerja.</> },
    { num: 9, text: <>Setelah proses administrasi (2 hari kerja), barang diproses kirim oleh ekspedisi. <b>Lama pengiriman ± 7 - 9 hari kerja</b>.</> },
    { num: 10, text: <><b>Gratis ongkir</b> untuk produk dengan logo "gratis ongkir". Berlaku untuk area <b>PULAU JAWA, MADURA & BALI saja</b>. (Kecamatan yang bisa dijangkau oleh pihak ekspedisi).</> },
    { num: 11, text: <>Ada subsidi ongkir untuk pengiriman di luar Pulau Jawa, Madura & Bali.</> },
    { num: 12, text: <>Toleransi kemiripan warna produk 95% karena pengaruh pencahayaan saat proses pengambilan foto produk/rendering, & resolusi layar smartphone yang beragam.</> }
  ];

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.hero}>
          <div className={styles.tagWrapper}>
            <span className={styles.tag}>Layanan Pelanggan</span>
          </div>
          <h1 className={styles.title}>Informasi & Garansi</h1>
          <p className={styles.description}>
            Demi kenyamanan bersama, harap baca informasi penting di bawah ini mengenai pesanan, pengiriman, dan prosedur klaim produk ZAM Edutoys.
          </p>
        </div>

        <div className={styles.accordionWrapper}>
          <AccordionItem 
            title="Informasi Penting" 
            isOpen={openSection === 'penting'} 
            onClick={() => toggleSection('penting')}
          >
            <ul className={styles.pointList}>
              {importantPoints.map((point) => (
                <li key={point.num} className={styles.pointItem}>
                  <span className={styles.pointNumber}>{point.num}.</span>
                  <span className={styles.pointText}>{point.text}</span>
                </li>
              ))}
            </ul>
          </AccordionItem>

          <AccordionItem 
            title="Panduan Perawatan Produk" 
            isOpen={openSection === 'perawatan'} 
            onClick={() => toggleSection('perawatan')}
          >
            <ul className={styles.pointList}>
              <li className={styles.pointItem}>
                <span className={styles.pointNumber}>1.</span>
                <span className={styles.pointText}>Tidak disarankan diletakkan di luar ruangan atau tempat yang lembab. Pastikan kelembaban ruangan berada pada kisaran <b>40% hingga 60%</b> agar kayu tetap awet dan tidak mudah berjamur.</span>
              </li>
              <li className={styles.pointItem}>
                <span className={styles.pointNumber}>2.</span>
                <span className={styles.pointText}>Hindari kontak langsung dengan air, bahan kimia keras, dan paparan sinar matahari langsung dalam waktu lama untuk menjaga kualitas warna dan serat kayu.</span>
              </li>
              <li className={styles.pointItem}>
                <span className={styles.pointNumber}>3.</span>
                <span className={styles.pointText}>Bersihkan furnitur secara rutin cukup dengan <b>kain kering atau microfiber</b> yang lembut.</span>
              </li>
              <li className={styles.pointItem}>
                <span className={styles.pointNumber}>4.</span>
                <span className={styles.pointText}>Apabila terdapat noda membandel, gunakan kain lembab dengan sedikit sabun lembut (pH netral), lalu <b>segera seka hingga kering</b> dengan lap bersih. Jangan biarkan air menggenang di permukaan kayu.</span>
              </li>
              <li className={styles.pointItem}>
                <span className={styles.pointNumber}>5.</span>
                <span className={styles.pointText}>Jangan gunakan pembersih abrasif, sikat kawat, atau bahan kimia keras (seperti thiner atau aseton) yang dapat merusak lapisan finishing/coating kayu.</span>
              </li>
              <li className={styles.pointItem}>
                <span className={styles.pointNumber}>6.</span>
                <span className={styles.pointText}>Tidak disarankan menggeser atau menyeret furnitur di lantai. Getaran dan gesekan dapat merusak struktur sambungan kayu. Disarankan menggunakan alat bantu seperti troli atau furniture mover jika ingin memindahkan produk.</span>
              </li>
              <li className={styles.pointItem}>
                <span className={styles.pointNumber}>7.</span>
                <span className={styles.pointText}>Jika memindahkan furnitur ke tempat yang lebih tinggi (seperti lantai dua), disarankan furnitur dibongkar terlebih dahulu (terutama untuk unit yang besar dan berat) demi keamanan pengangkutan.</span>
              </li>
              <li className={styles.pointItem}>
                <span className={styles.pointNumber}>8.</span>
                <span className={styles.pointText}>Hindari gesekan atau benturan keras dengan benda tajam agar lapisan pelindung kayu tidak tergores atau terkelupas.</span>
              </li>
              <li className={styles.pointItem}>
                <span className={styles.pointNumber}>9.</span>
                <span className={styles.pointText}>Apabila terdapat bagian coating yang terkelupas, disarankan untuk segera melapisi kembali (refinish) agar material kayu tetap terlindungi dari kelembaban dan serangan hama.</span>
              </li>
            </ul>
          </AccordionItem>

          <AccordionItem 
            title="Syarat dan Ketentuan Komplain" 
            isOpen={openSection === 'komplain'} 
            onClick={() => toggleSection('komplain')}
          >
            <ul className={styles.pointList}>
              <li className={styles.pointItem}>
                <span className={styles.pointNumber}>•</span>
                <span className={styles.pointText}>Wajib melampirkan <b>Video Unboxing</b> yang jelas tanpa terputus.</span>
              </li>
              <li className={styles.pointItem}>
                <span className={styles.pointNumber}>•</span>
                <span className={styles.pointText}>Laporan kerusakan maksimal 24 jam setelah barang diterima menurut resi ekspedisi.</span>
              </li>
              <li className={styles.pointItem}>
                <span className={styles.pointNumber}>•</span>
                <span className={styles.pointText}>Produk belum dibongkar/dirakit jika ingin mengajukan penukaran karena tidak sesuai pesanan.</span>
              </li>
            </ul>
          </AccordionItem>
        </div>

        <div className={styles.highlightBox}>
          <h2 className={styles.highlightTitle}>Bebas Khawatir Bersama ZAM Edutoys</h2>
          <p className={styles.highlightText}>
            Tim Customer Service kami selalu siap membantu jika Anda mengalami kendala pada produk atau pengiriman.
          </p>
          <a href="https://wa.me/628995366864?text=Halo%20Admin,%20saya%20ingin%20berkonsultasi%20mengenai%20pesanan%20saya." target="_blank" rel="noopener noreferrer" className={styles.claimBtn}>
            Hubungi Customer Service
          </a>
        </div>
      </div>
    </main>
  );
}
