'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './image-slider.module.sass';

export interface SliderImage {
  filename: string;
  alt?: string;
  id?: string | null;
}

interface ImageSliderProps {
  images: SliderImage[];
  fit?: 'contain' | 'cover';
}

const BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';

export function ImageSlider({
  images,
  fit = 'contain',
}: ImageSliderProps) {
  const validImages = images.filter((image) => image?.filename);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [validImages.length]);

  if (!validImages.length) return null;

  const goToSlide = (nextIndex: number) => {
    setCurrentIndex((nextIndex + validImages.length) % validImages.length);
  };

  return (
    <div className={styles.slider} data-fit={fit}>
      <div className={styles.viewport}>
        <div
          className={styles.track}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {validImages.map((image, index) => (
            <div
              className={styles.slide}
              key={image.id || `${image.filename}-${index}`}
            >
              <Image
                src={`${image.filename}/m/filters:quality(60)`}
                alt={image.alt ?? ''}
                fill
                sizes="100vw"
                unoptimized
                loading="lazy"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className={`${styles.slideImage} imageLoad`}
                onLoad={(event) => {
                  event.currentTarget.style.opacity = '1';
                }}
              />
            </div>
          ))}
        </div>
      </div>
      {validImages.length > 1 && (
        <>
          <div className={styles.controls}>
            <button
              type="button"
              className={`${styles.button} cursorInteract`}
              onClick={() => goToSlide(currentIndex - 1)}
              aria-label="Previous image"
            >
              Prev
            </button>
            <button
              type="button"
              className={`${styles.button} cursorInteract`}
              onClick={() => goToSlide(currentIndex + 1)}
              aria-label="Next image"
            >
              Next
            </button>
          </div>
          <div className={styles.pagination}>
            {validImages.map((image, index) => (
              <button
                key={image.id || `${image.filename}-dot-${index}`}
                type="button"
                className={`${styles.dot} cursorInteract`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to image ${index + 1}`}
                aria-pressed={index === currentIndex}
                data-active={index === currentIndex}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
