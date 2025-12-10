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
  console.log('ContentProfile', blok);
  return (
    <div className={styles.contentProfile} {...storyblokEditable(blok)}>
      {blok.portrait && blok.portrait.filename && (
        <div className={styles.imageContainer}>
          <Image
            src={`${blok.portrait.filename}/m/filters:quality(60)`}
            alt={blok.portrait.alt || blok.name || 'Profile image'}
            width={200}
            height={200}
            className={styles.image}
          />
        </div>
      )}
      {blok.name && <div className={styles.name}>{blok.name}</div>}
      {blok.text && <div className={styles.text}>{blok.text}</div>}
    </div>
  );
}
