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
  text: string;
  text_top: string;
  text_bottom: string;
  text_align: 'left' | 'center';
  background?: string;
}

interface ContentBlokProps {
  blok: SbContentBlokData;
}

export default function ContentBlok({ blok }: ContentBlokProps) {
  console.log('ContentBlok', blok);

  return (
    <div
      className={styles.contentBlok}
      {...storyblokEditable(blok)}
      style={blok.background ? { backgroundColor: blok.background } : {}}
      data-background={blok.background || 'none'}
    >
      {blok.background_image && blok.background_image.id !== null && (
        <div className={styles.image} data-size={blok.image_size || 'medium'}>
          <div className={styles.imageContainer}>
            <Image
              src={blok.background_image.filename}
              alt={blok.background_image.alt ?? ''}
              fill
              sizes="100vw"
              quality={33}
              className={`${styles.image} imageload`}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              onLoad={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            />
          </div>
        </div>
      )}
      <div className={styles.text} data-align={blok.text_align || 'center'}>
        {blok.text_top && (
          <div className={`${styles.textCaption} ${styles.textCaption_Top}`}>
            {blok.text_top}
          </div>
        )}
        <div className={styles.textMain}>
          {blok.text && <Markdown content={blok.text} />}
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
