'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './image-slider.module.sass';

export interface SliderImage {
  filename: string;
  alt?: string;
  id?: string | null;
  width?: number;
  height?: number;
}

interface ImageSliderProps {
  images: SliderImage[];
  fit?: 'contain' | 'cover';
  heightMode?: 'fill' | 'auto';
}

const BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';

const FALLBACK_WIDTH = 1600;
const FALLBACK_HEIGHT = 900;

const getImageDimensions = (image: SliderImage) => {
  if (image.width && image.height) {
    return { width: image.width, height: image.height };
  }

  const match = image.filename.match(/\/(\d+)x(\d+)\//);
  if (match) {
    return {
      width: Number(match[1]),
      height: Number(match[2]),
    };
  }

  return {
    width: FALLBACK_WIDTH,
    height: FALLBACK_HEIGHT,
  };
};

export function ImageSlider({
  images,
  fit = 'contain',
  heightMode = 'fill',
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
    <div className={styles.slider} data-fit={fit} data-height-mode={heightMode}>
      <div className={styles.viewport}>
        <div
          className={styles.track}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {validImages.map((image, index) => {
            const dimensions = getImageDimensions(image);

            return (
              <div
                className={styles.slide}
                key={image.id || `${image.filename}-${index}`}
              >
                {heightMode === 'auto' ? (
                  <Image
                    src={`${image.filename}/m/filters:quality(60)`}
                    alt={image.alt ?? ''}
                    width={dimensions.width}
                    height={dimensions.height}
                    sizes="100vw"
                    unoptimized
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    className={`${styles.slideImage} ${styles.slideImageAuto} imageLoad`}
                    onLoad={(event) => {
                      event.currentTarget.style.opacity = '1';
                    }}
                  />
                ) : (
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
                )}
              </div>
            );
          })}
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
