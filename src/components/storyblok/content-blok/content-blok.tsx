import {
  StoryblokServerComponent,
  SbBlokData,
  storyblokEditable,
} from '@storyblok/react/rsc';
import styles from './content-blok.module.sass';

interface SbContentBlokData extends SbBlokData {
  background?: string;
  body: SbBlokData[];
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
      style={{
        backgroundColor: blok.background || 'transparent',
      }}
    >
      {blok.body?.map((nestedBlok) => (
        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  );
}
