import { SbBlokData, storyblokEditable } from '@storyblok/react/rsc';
import styles from './content-blok.module.sass';
import Markdown from '@/components/markdown/markdown';
import Image from 'next/image';

interface SbContentBlokData extends SbBlokData {
  background_image?: {
    filename: string;
    alt?: string;
    id: string | null;
  };
  image_size?: 'fullscreen' | 'large' | 'medium' | 'small';
  img_align?:
    | 'topleft'
    | 'left'
    | 'bottomleft'
    | 'topcenter'
    | 'center'
    | 'bottomcenter'
    | 'topright'
    | 'right'
    | 'bottomright';
  text: string;
  text_background?: boolean;
  text_top: string;
  text_bottom: string;
  text_align:
    | 'topleft'
    | 'left'
    | 'bottomleft'
    | 'topcenter'
    | 'center'
    | 'bottomcenter'
    | 'topright'
    | 'right'
    | 'bottomright';
  background?:
    | 'default'
    | 'accent'
    | 'white'
    | 'stone'
    | 'blue'
    | 'burgundy'
    | 'black';
  width?: 'full' | 'concise';
}

interface ContentBlokProps {
  blok: SbContentBlokData;
}

export default function ContentBlok({ blok }: ContentBlokProps) {
  return (
    <div
      className={styles.contentBlok}
      {...storyblokEditable(blok)}
      data-background={blok.background || 'default'}
    >
      {blok.background_image && blok.background_image.id !== null && (
        <div
          className={styles.image}
          data-size={blok.image_size || 'medium'}
          data-align={blok.img_align || 'center'}
        >
          <div className={styles.imageContainer}>
            <Image
              src={`${blok.background_image.filename}/m/filters:quality(60)`}
              alt={blok.background_image.alt ?? ''}
              fill
              sizes="100vw"
              unoptimized
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              className={`imageLoad`}
              onLoad={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            />
          </div>
        </div>
      )}
      <div
        className={styles.text}
        data-align={blok.text_align || 'center'}
        data-caption-top={blok.text_top ? true : false}
        data-caption-bottom={blok.text_bottom ? true : false}
      >
        {blok.text_top && (
          <div className={`${styles.textCaption} ${styles.textCaption_Top}`}>
            {blok.text_top}
          </div>
        )}
        <div className={styles.textMain} data-background={blok.text_background}>
          {blok.text && (
            <Markdown content={blok.text} width={blok.width || 'full'} />
          )}
        </div>
        {blok.text_bottom && (
          <div className={`${styles.textCaption} ${styles.textCaption_Bottom}`}>
            {blok.text_bottom}
          </div>
        )}
      </div>
    </div>
  );
}
