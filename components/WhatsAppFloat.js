"use client";
import React from 'react';
import styles from './WhatsAppFloat.module.css';

export default function WhatsAppFloat() {
  const phoneNumber = "6281234567890"; // Ganti dengan nomor WhatsApp Anda
  const message = "Halo ZAM EDUTOYS, saya ingin bertanya tentang produk Anda.";
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a 
      href={whatsappUrl} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={styles.floatButton}
      aria-label="Chat WhatsApp"
    >
      <div className={styles.pulseArea}></div>
      <i className="fa-brands fa-whatsapp"></i>
    </a>
  );
}
