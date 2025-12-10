import styles from './content-data.module.sass';
import {
  StoryblokServerComponent,
  SbBlokData,
  storyblokEditable,
} from '@storyblok/react/rsc';

interface SbContentDataData extends SbBlokData {
  body: SbBlokData[];
}

interface ContentDataProps {
  blok: SbContentDataData;
}

export default function ContentData({ blok }: ContentDataProps) {
  console.log('ContentData', blok);

  return (
    <div className={styles.contentData} {...storyblokEditable(blok)}>
      {blok.body?.map((nestedBlok) => (
        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  );
}
