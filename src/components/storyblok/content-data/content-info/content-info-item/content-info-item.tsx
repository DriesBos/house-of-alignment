import styles from './content-info-item.module.sass';
import { SbBlokData, storyblokEditable } from '@storyblok/react/rsc';

interface SbContentProfileData extends SbBlokData {
  left?: string;
  right?: string;
}

interface ContentInfoItemProps {
  blok: SbContentProfileData;
}

export default function ContentInfoItem({ blok }: ContentInfoItemProps) {
  return (
    <div className={styles.contentInfoItem} {...storyblokEditable(blok)}>
      {blok.left && <div className={styles.left}>{blok.left}</div>}
      {blok.right && <div className={styles.right}>{blok.right}</div>}
    </div>
  );
}
