import styles from './content-profile.module.sass';
import Image from 'next/image';
import { SbBlokData, storyblokEditable } from '@storyblok/react/rsc';

interface SbContentProfileData extends SbBlokData {
  portrait?: {
    filename: string;
    alt?: string;
  };
  name?: string;
  text?: string;
}

interface ContentProfileProps {
  blok: SbContentProfileData;
}

export default function ContentProfile({ blok }: ContentProfileProps) {
  return (
    <div className={styles.contentProfile} {...storyblokEditable(blok)}>
      {blok.portrait && blok.portrait.filename && (
        <div className={styles.imageContainer}>
          <Image
            src={`${blok.portrait.filename}/m/filters:quality(60)`}
            alt={blok.portrait.alt || blok.name || 'Profile image'}
            width={200}
            height={200}
            unoptimized
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            className={`${styles.image} imageLoad`}
            onLoad={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          />
        </div>
      )}
      {blok.name && <div className={styles.name}>{blok.name}</div>}
      {blok.text && <div className={styles.text}>{blok.text}</div>}
    </div>
  );
}
