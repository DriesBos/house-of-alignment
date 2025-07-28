import {
  StoryblokServerComponent,
  SbBlokData,
  storyblokEditable,
} from '@storyblok/react/rsc';
import styles from './content-blok.module.sass';

interface SbContentBlokData extends SbBlokData {
  body: SbBlokData[];
}

interface ContentBlokProps {
  blok: SbContentBlokData;
}

export default function ContentBlok({ blok }: ContentBlokProps) {
  console.log('ContentBlok', blok.body);

  return (
    <div className={styles.contentBlok} {...storyblokEditable(blok)}>
      {blok.body?.map((nestedBlok, index) => (
        <StoryblokServerComponent blok={nestedBlok} key={index} />
      ))}
    </div>
  );
}
