import {
  // StoryblokServerComponent,
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
      {blok.body?.map((nestedBlok) => (
        // <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
        <p className="text" key={nestedBlok._uid}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      ))}
    </div>
  );
}
