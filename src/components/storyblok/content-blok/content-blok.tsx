import {
  StoryblokServerComponent,
  SbBlokData,
  storyblokEditable,
} from '@storyblok/react/rsc';
import styles from './content-blok.module.sass';

interface SbContentBlokData extends SbBlokData {
  background?: string;
  background_image?: {
    filename: string;
    alt?: string;
  };
  body: SbBlokData[];
}

interface ContentBlokProps {
  blok: SbContentBlokData;
}

export default function ContentBlok({ blok }: ContentBlokProps) {
  console.log('ContentBlok', blok);

  // Create consistent style object to avoid hydration mismatch
  const backgroundStyles = {
    backgroundColor: blok.background_image
      ? undefined
      : blok.background || undefined,
    backgroundImage: blok.background_image
      ? `url(${blok.background_image.filename})`
      : undefined,
  };

  return (
    <div
      className={styles.contentBlok}
      {...storyblokEditable(blok)}
      style={backgroundStyles}
      data-background={blok.background || 'none'}
    >
      {blok.body?.map((nestedBlok) => (
        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  );
}
