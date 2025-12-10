import styles from './content-rsvp.module.sass';
import { SbBlokData, storyblokEditable } from '@storyblok/react/rsc';

interface SbContentRsvpData extends SbBlokData {
  hyperlink?: {
    filename: string;
    alt?: string;
  };
  button_text?: string;
}

interface ContentRsvpProps {
  blok: SbContentRsvpData;
}

export default function ContentRsvp({ blok }: ContentRsvpProps) {
  return (
    <div className={styles.contentRsvp} {...storyblokEditable(blok)}>
      {blok.button_text}
    </div>
  );
}
