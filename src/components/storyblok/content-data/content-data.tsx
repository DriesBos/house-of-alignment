import styles from './content-data.module.sass';
import {
  StoryblokServerComponent,
  SbBlokData,
  storyblokEditable,
} from '@storyblok/react/rsc';

interface SbContentDataData extends SbBlokData {
  body: SbBlokData[];
  text_top: string;
  text_bottom: string;
  background?:
    | 'default'
    | 'accent'
    | 'white'
    | 'stone'
    | 'blue'
    | 'burgundy'
    | 'black';
}

interface ContentDataProps {
  blok: SbContentDataData;
}

export default function ContentData({ blok }: ContentDataProps) {
  return (
    <div
      className={styles.contentData}
      {...storyblokEditable(blok)}
      data-background={blok.background || 'default'}
    >
      {blok.text_top && (
        <div className={`${styles.textCaption} ${styles.textCaption_Top}`}>
          {blok.text_top}
        </div>
      )}
      {blok.body?.map((nestedBlok) => (
        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
      {blok.text_bottom && (
        <div className={`${styles.textCaption} ${styles.textCaption_Bottom}`}>
          {blok.text_bottom}
        </div>
      )}
    </div>
  );
}
