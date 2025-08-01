'use client';

import { SbBlokData, storyblokEditable } from '@storyblok/react/rsc';
import styles from './divider-blok.module.sass';

interface SbPageData extends SbBlokData {
  title?: string;
}

interface DividerBlokProps {
  blok: SbPageData;
}

const DividerBlok: React.FunctionComponent<DividerBlokProps> = ({ blok }) => {
  return (
    <div
      className={styles.dividerBlok}
      {...storyblokEditable(blok)}
      data-fullscreen={blok.fullscreen || false}
    >
      {blok.title && <span>{blok.title}</span>}
    </div>
  );
};

export default DividerBlok;
