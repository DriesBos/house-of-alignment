import styles from './content-info.module.sass';
import {
  StoryblokServerComponent,
  SbBlokData,
  storyblokEditable,
} from '@storyblok/react/rsc';

interface SbContentInfoData extends SbBlokData {
  body: SbBlokData[];
}

interface ContentInfoProps {
  blok: SbContentInfoData;
}

export default function ContentInfo({ blok }: ContentInfoProps) {
  return (
    <div className={styles.contentInfo} {...storyblokEditable(blok)}>
      {blok.body?.map((nestedBlok) => (
        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  );
}
