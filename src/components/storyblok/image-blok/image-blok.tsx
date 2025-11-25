import { SbBlokData, storyblokEditable } from '@storyblok/react/rsc';
import React from 'react';
import Image from 'next/image';
import type { StaticImport } from 'next/dist/shared/lib/get-img-props';
import styles from './image-blok.module.sass';

interface SbImageBlokData extends SbBlokData {
  image?: {
    filename: string | StaticImport;
    alt?: string;
  };
  caption?: string;
}

interface ImageBlokProps {
  blok: SbImageBlokData;
}

const ImageBlok: React.FunctionComponent<ImageBlokProps> = ({ blok }) => {
  console.log('ImageBlok', blok);

  return (
    <div
      className={styles.imageBlok}
      {...storyblokEditable(blok)}
      data-fullscreen={blok.fullscreen || false}
    >
      {blok.image && (
        <div
          className={styles.imageContainer}
          data-size={blok.size || 'medium'}
        >
          <Image
            src={blok.image.filename}
            alt={blok.image.alt ?? ''}
            fill
            sizes="100vw"
            quality={40}
            className={`${styles.image} imageload`}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            onLoad={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          />
        </div>
      )}
      {blok.caption && <div className={styles.caption}>{blok.caption}</div>}
    </div>
  );
};

export default ImageBlok;
