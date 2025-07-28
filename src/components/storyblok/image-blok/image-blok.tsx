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
            width={0}
            height={0}
            quality={40}
            className={styles.image}
            objectFit="contain"
          />
        </div>
      )}
      {blok.caption && <div className={styles.caption}>{blok.caption}</div>}
    </div>
  );
};

export default ImageBlok;
