import React from 'react';
import styles from './PaymentSection.module.css';

const payments = [
  {
    group: 'Transfer Bank',
    items: [
      { name: 'BCA', bg: '#005baa', color: '#fff', accent: '#fff', label: 'BCA' },
      { name: 'Mandiri', bg: '#003d6b', color: '#f5a800', accent: '#f5a800', label: 'MANDIRI' },
      { name: 'BRI', bg: '#003399', color: '#fff', accent: '#ff6600', label: 'BRI' },
      { name: 'BNI', bg: '#f47920', color: '#fff', accent: '#fff', label: 'BNI' },
      { name: 'BSI', bg: '#2e8b4a', color: '#fff', accent: '#fff', label: 'BSI' },
      { name: 'CIMB Niaga', bg: '#c8102e', color: '#fff', accent: '#fff', label: 'CIMB\nNIAGA' },
      { name: 'Permata', bg: '#7b1c8c', color: '#fff', accent: '#e8c84b', label: 'PERMATA' },
      { name: 'Danamon', bg: '#0f5ea8', color: '#fff', accent: '#f47920', label: 'DANAMON' },
    ],
  },
  {
    group: 'Dompet Digital',
    items: [
      { name: 'GoPay', bg: '#00AED6', color: '#fff', accent: '#fff', label: 'GoPay' },
      { name: 'OVO', bg: '#4c3494', color: '#fff', accent: '#fff', label: 'OVO' },
      { name: 'Dana', bg: '#118EEA', color: '#fff', accent: '#fff', label: 'DANA' },
      { name: 'ShopeePay', bg: '#f05a28', color: '#fff', accent: '#fff', label: 'ShopeePay' },
      { name: 'LinkAja', bg: '#e62129', color: '#fff', accent: '#fff', label: 'LinkAja' },
      { name: 'AstraPay', bg: '#e8b200', color: '#333', accent: '#333', label: 'AstraPay' },
    ],
  },
  {
    group: 'Metode Lain',
    items: [
      { name: 'QRIS', bg: '#e03e2d', color: '#fff', accent: '#fff', label: 'QRIS', isQris: true },
      { name: 'COD', bg: '#f5f5f5', color: '#333', accent: '#ee4d2d', label: 'COD', isCod: true },
      { name: 'Visa', bg: '#1a1f71', color: '#fff', accent: '#f7a600', label: 'VISA', isVisa: true },
      { name: 'Mastercard', bg: '#ffffff', color: '#333', accent: '#EB001B', label: 'MC', isMc: true },
      { name: 'JCB', bg: '#003087', color: '#fff', accent: '#fff', label: 'JCB' },
      { name: 'Indomaret', bg: '#e30512', color: '#fff', accent: '#fff', label: 'INDOMARET' },
      { name: 'Alfamart', bg: '#e63027', color: '#fff', accent: '#fff', label: 'ALFAMART' },
    ],
  },
];

function PaymentLogo({ item }) {
  if (item.isQris) {
    return (
      <div className={styles.logoCard} title="QRIS">
        <div className={styles.logoImgWrapper}>
          <img src="/qris.png" alt="QRIS" className={styles.logoImg} />
        </div>
        <span className={styles.logoName}>{item.name}</span>
      </div>
    );
  }

  if (item.isCod) {
    return (
      <div className={styles.logoCard} title="COD - Bayar di Tempat">
        <svg viewBox="0 0 80 40" xmlns="http://www.w3.org/2000/svg" className={styles.logoSvg}>
          <rect width="80" height="40" rx="6" fill="#f8f8f8" stroke="#e0e0e0" strokeWidth="1" />
          <text x="40" y="18" textAnchor="middle" fill="#ee4d2d" fontFamily="Arial" fontSize="14" fontWeight="900">COD</text>
          <text x="40" y="31" textAnchor="middle" fill="#888" fontFamily="Arial" fontSize="7">Bayar di Tempat</text>
        </svg>
        <span className={styles.logoName}>{item.name}</span>
      </div>
    );
  }

  if (item.isVisa) {
    return (
      <div className={styles.logoCard} title="Visa">
        <svg viewBox="0 0 80 40" xmlns="http://www.w3.org/2000/svg" className={styles.logoSvg}>
          <rect width="80" height="40" rx="6" fill="#1a1f71" />
          <text x="40" y="26" textAnchor="middle" fill="white" fontFamily="Arial" fontSize="20" fontWeight="900" fontStyle="italic">VISA</text>
        </svg>
        <span className={styles.logoName}>{item.name}</span>
      </div>
    );
  }

  if (item.isMc) {
    return (
      <div className={styles.logoCard} title="Mastercard">
        <svg viewBox="0 0 80 40" xmlns="http://www.w3.org/2000/svg" className={styles.logoSvg}>
          <rect width="80" height="40" rx="6" fill="white" stroke="#e0e0e0" strokeWidth="1" />
          <circle cx="30" cy="20" r="12" fill="#EB001B" />
          <circle cx="50" cy="20" r="12" fill="#F79E1B" />
          <path d="M40 11 A12 12 0 0 1 40 29 A12 12 0 0 1 40 11" fill="#FF5F00" />
        </svg>
        <span className={styles.logoName}>{item.name}</span>
      </div>
    );
  }

  return (
    <div className={styles.logoCard} title={item.name}>
      <svg viewBox="0 0 80 40" xmlns="http://www.w3.org/2000/svg" className={styles.logoSvg}>
        <rect width="80" height="40" rx="6" fill={item.bg} />
        {item.label.includes('\n') ? (
          item.label.split('\n').map((line, i) => (
            <text
              key={i}
              x="40"
              y={item.label.split('\n').length === 1 ? 25 : 18 + i * 12}
              textAnchor="middle"
              fill={item.color}
              fontFamily="Arial, sans-serif"
              fontSize={line.length > 8 ? 8 : 11}
              fontWeight="bold"
            >
              {line}
            </text>
          ))
        ) : (
          <text
            x="40"
            y="25"
            textAnchor="middle"
            fill={item.color}
            fontFamily="Arial, sans-serif"
            fontSize={item.label.length > 8 ? 8 : item.label.length > 6 ? 10 : 13}
            fontWeight="bold"
            letterSpacing="0.5"
          >
            {item.label}
          </text>
        )}
      </svg>
      <span className={styles.logoName}>{item.name}</span>
    </div>
  );
}

export default function PaymentSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headingRow}>
          <div className={styles.iconWrap}>🔒</div>
          <div>
            <h2 className={styles.heading}>Metode Pembayaran Tersedia</h2>
            <p className={styles.sub}>Transaksi aman &amp; terpercaya dengan berbagai pilihan pembayaran</p>
          </div>
        </div>

        <div className={styles.groups}>
          {payments.map((group) => (
            <div key={group.group} className={styles.group}>
              <h3 className={styles.groupTitle}>{group.group}</h3>
              <div className={styles.logos}>
                {group.items.map((item) => (
                  <PaymentLogo key={item.name} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <span>🛡️ Pembayaran dienkripsi &amp; dilindungi</span>
          <span>•</span>
          <span>📦 Garansi pengiriman &amp; keaslian produk</span>
          <span>•</span>
          <span>🔄 Mudah retur &amp; refund</span>
        </div>
      </div>
    </section>
  );
}
