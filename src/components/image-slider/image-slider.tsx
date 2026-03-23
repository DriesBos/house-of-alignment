'use client';

import { type PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from 'react';
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
  sizing?: string;
}

const BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';

const FALLBACK_WIDTH = 1600;
const FALLBACK_HEIGHT = 900;
const SWIPE_THRESHOLD = 48;

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
  sizing,
}: ImageSliderProps) {
  const validImages = images.filter((image) => image?.filename);
  const [currentIndex, setCurrentIndex] = useState(0);
  const swipeStateRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    deltaX: number;
    deltaY: number;
  } | null>(null);

  useEffect(() => {
    setCurrentIndex(0);
  }, [validImages.length]);

  if (!validImages.length) return null;

  const goToSlide = (nextIndex: number) => {
    setCurrentIndex((nextIndex + validImages.length) % validImages.length);
  };

  const goToPreviousSlide = () => {
    setCurrentIndex((index) => (index - 1 + validImages.length) % validImages.length);
  };

  const goToNextSlide = () => {
    setCurrentIndex((index) => (index + 1) % validImages.length);
  };

  const resetSwipe = () => {
    swipeStateRef.current = null;
  };

  const releasePointerCapture = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (validImages.length < 2 || event.pointerType === 'mouse') return;

    swipeStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      deltaX: 0,
      deltaY: 0,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const swipeState = swipeStateRef.current;
    if (!swipeState || swipeState.pointerId !== event.pointerId) return;

    swipeStateRef.current = {
      ...swipeState,
      deltaX: event.clientX - swipeState.startX,
      deltaY: event.clientY - swipeState.startY,
    };
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    const swipeState = swipeStateRef.current;
    if (!swipeState || swipeState.pointerId !== event.pointerId) return;

    releasePointerCapture(event);
    resetSwipe();

    if (
      Math.abs(swipeState.deltaX) < SWIPE_THRESHOLD ||
      Math.abs(swipeState.deltaX) <= Math.abs(swipeState.deltaY)
    ) {
      return;
    }

    if (swipeState.deltaX < 0) {
      goToNextSlide();
      return;
    }

    goToPreviousSlide();
  };

  return (
    <div
      className={styles.slider}
      data-fit={fit}
      data-height-mode={heightMode}
      data-sizing={sizing}
    >
      <div
        className={styles.viewport}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      >
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
              onClick={goToPreviousSlide}
              aria-label="Previous image"
            >
              Prev
            </button>
            <button
              type="button"
              className={`${styles.button} cursorInteract`}
              onClick={goToNextSlide}
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
