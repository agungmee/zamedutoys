import React from 'react';
import styles from './AboutSection.module.css';
import Image from 'next/image';

export default function AboutSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textSide}>
            <span className={styles.label}>TENTANG KAMI</span>
            <h2 className={styles.title}>Menciptakan Dunia Bermain yang Edukatif</h2>
            <p className={styles.description}>
              ZAM EDUTOYS berdedikasi untuk menghadirkan mainan edukasi berkualitas tinggi yang dirancang khusus untuk merangsang perkembangan kognitif, motorik, dan kreativitas anak. Kami percaya bahwa setiap anak layak mendapatkan alat bermain yang tidak hanya menghibur, tetapi juga membangun masa depan mereka.
            </p>
            <div className={styles.features}>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>✅</span>
                <div>
                  <h4 className={styles.featureTitle}>Kualitas Premium</h4>
                  <p className={styles.featureText}>Bahan kayu pilihan yang aman dan tahan lama.</p>
                </div>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>🎨</span>
                <div>
                  <h4 className={styles.featureTitle}>Desain Kreatif</h4>
                  <p className={styles.featureText}>Warna-warna cerah dengan pewarna non-toxic aman bagi anak.</p>
                </div>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>🧠</span>
                <div>
                  <h4 className={styles.featureTitle}>Membangun Skill</h4>
                  <p className={styles.featureText}>Dirancang oleh para ahli untuk tumbuh kembang si kecil.</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.imageSide}>
            <div className={styles.imageFrame}>
               <Image 
                src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=2070&auto=format&fit=crop" 
                alt="Mainan Edukasi Kayu" 
                fill
                style={{ objectFit: 'cover' }}
                className={styles.image}
              /> 
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
