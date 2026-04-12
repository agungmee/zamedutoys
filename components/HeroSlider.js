"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './HeroSlider.module.css';

const slides = [
  { id: 1, src: '/slide_1.png', alt: 'Educational Toy Banner 1 - Wooden Blocks' },
  { id: 2, src: '/slide_2.png', alt: 'Educational Toy Banner 2 - Science Kits' },
  { id: 3, src: '/slide_3.png', alt: 'Educational Toy Banner 3 - Montessori Puzzles' },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); // Auto slide every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.aspectRatioWrapper}>
        {slides.map((slide, index) => (
          <div 
            key={slide.id} 
            className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
          >
            <Image 
              src={slide.src} 
              alt={slide.alt} 
              fill 
              style={{ objectFit: 'cover' }} 
              priority={index === 0}
            />
          </div>
        ))}
        
        {/* Navigation Dots */}
        <div className={styles.dotsContainer}>
          {slides.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
