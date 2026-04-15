"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './HeroSlider.module.css';

export default function HeroSlider({ initialBanners = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState(initialBanners);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000); 
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.aspectRatioWrapper}>
        {banners.map((banner, index) => {
          const slideContent = (
            <>
              <Image 
                src={banner.image_url} 
                alt={banner.title || 'Educational Toy Banner'} 
                fill 
                style={{ objectFit: 'cover' }} 
                priority={index === 0}
              />
              {(banner.title || banner.subtitle) && (
                <div className={styles.overlay}>
                  {banner.title && <h2 className={styles.slideTitle}>{banner.title}</h2>}
                  {banner.subtitle && <p className={styles.slideSubtitle}>{banner.subtitle}</p>}
                </div>
              )}
            </>
          );

          return (
            <div 
              key={banner.id} 
              className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
            >
              {banner.link_url ? (
                <Link href={banner.link_url} className={styles.slideLink}>
                  {slideContent}
                </Link>
              ) : (
                slideContent
              )}
            </div>
          );
        })}
        
        {/* Navigation Dots */}
        {banners.length > 1 && (
          <div className={styles.dotsContainer}>
            {banners.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ''}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

