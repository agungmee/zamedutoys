import React from 'react';
import styles from './PaymentSection.module.css';

const payments = [
  { name: 'BCA', bg: '#005baa', color: '#fff', accent: '#fff', label: 'BCA' },
  { name: 'BSI', bg: '#2e8b4a', color: '#fff', accent: '#fff', label: 'BSI' },
  { name: 'Dana', bg: '#118EEA', color: '#fff', accent: '#fff', label: 'DANA' },
  { name: 'ShopeePay', bg: '#f05a28', color: '#fff', accent: '#fff', label: 'ShopeePay' },
  { name: 'QRIS', bg: '#e03e2d', color: '#fff', accent: '#fff', label: 'QRIS', isQris: true },
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

export default function PaymentSection({ showHeader = true, showFooter = true, isSection = true }) {
  const content = (
    <div className={styles.container}>
      {showHeader && (
        <div className={styles.headingRow}>
          <div className={styles.iconWrap}>🔒</div>
          <div>
            <h2 className={styles.heading}>Metode Pembayaran Tersedia</h2>
            <p className={styles.sub}>Transaksi aman &amp; terpercaya dengan berbagai pilihan pembayaran</p>
          </div>
        </div>
      )}

      <div className={styles.logos}>
        {payments.map((item) => (
          <PaymentLogo key={item.name} item={item} />
        ))}
      </div>

      {showFooter && (
        <div className={styles.footer}>
          <span>🛡️ Pembayaran dienkripsi &amp; dilindungi</span>
          <span>•</span>
          <span>📦 Garansi pengiriman &amp; keaslian produk</span>
          <span>•</span>
          <span>🔄 Mudah retur &amp; refund</span>
        </div>
      )}
    </div>
  );

  if (!isSection) {
    return <div className={styles.plainWrapper}>{content}</div>;
  }

  return (
    <section className={styles.section}>
      {content}
    </section>
  );
}
