import { SbBlokData, storyblokEditable } from '@storyblok/react/rsc';
import React, { useMemo } from 'react';
import Image from 'next/image';
import type { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { useLayoutStore } from '@/providers/layout-store-provider';
import styles from './index-blok.module.sass';
import IconChair from '@/components/icons/chair';
import IconWrapper from '@/components/icons/icon-wrapper/icon-wrapper';

interface SbIndexBlokData extends SbBlokData {
  title?: string;
  text?: string;
  seats?: number;
  thumbnail?: {
    filename: string | StaticImport;
    alt?: string;
  };
  link?: object;
}

interface IndexBlokProps {
  blok: SbIndexBlokData;
}

const IndexBlok: React.FunctionComponent<IndexBlokProps> = ({ blok }) => {
  const layout = useLayoutStore((state) => state.layout);

  const sizes = useMemo(() => {
    if (layout === 'one') {
      return '100vw';
    } else if (layout === 'two') {
      return '50vw';
    } else if (layout === 'three') {
      return '50vw, 25vw';
    }
    return '100vw'; // default fallback
  }, [layout]);

  return (
    <div {...storyblokEditable(blok)} className={styles.indexBlok}>
      <div className={styles.imageContainer}>
        {blok.seats && (
          <div className={styles.seats}>
            <IconWrapper>
              <IconChair />
            </IconWrapper>
            <span>{blok.seats}</span>
          </div>
        )}
        {blok.thumbnail && (
          <>
            {/* <div className="imageHoverLayer">
              <div className="imageHoverLayer_blok" />
            </div> */}
            <Image
              alt={blok.thumbnail.alt ?? ''}
              src={blok.thumbnail.filename}
              width={0}
              height={0}
              sizes={sizes}
              quality={40}
              loading="eager"
              priority={true}
              className="imageLoad"
              onLoad={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            />
          </>
        )}
      </div>
      {blok.title && <div>{blok.title}</div>}
      {blok.text && <div>{blok.text}</div>}
    </div>
  );
};

export default IndexBlok;
