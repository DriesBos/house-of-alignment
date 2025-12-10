import {
  StoryblokServerComponent,
  SbBlokData,
  storyblokEditable,
} from '@storyblok/react/rsc';
import styles from './content-container.module.sass';

interface SbContentBlokData extends SbBlokData {
  body: SbBlokData[];
}

interface ContentBlokProps {
  blok: SbContentBlokData;
}

export default function ContentContainer({ blok }: ContentBlokProps) {
  return (
    <div className={styles.contentContainer} {...storyblokEditable(blok)}>
      {blok.body?.map((nestedBlok) => (
        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  );
}
