import styles from './content-rsvp.module.sass';
import { SbBlokData, storyblokEditable } from '@storyblok/react/rsc';

interface SbContentRsvpData extends SbBlokData {
  button_text?: string;
  button_link?: {
    cached_url: string;
  };
}

interface ContentRsvpProps {
  blok: SbContentRsvpData;
}

export default function ContentRsvp({ blok }: ContentRsvpProps) {
  return (
    <div id="seats" className={styles.contentRsvp} {...storyblokEditable(blok)}>
      {blok.button_text}
    </div>
  );
}
