'use client';

import { SbBlokData, storyblokEditable } from '@storyblok/react/rsc';
import Markdown from '@/components/markdown/markdown';
import styles from './text-blok.module.sass';

interface SbPageData extends SbBlokData {
  text?: string;
  align?: 'left' | 'center' | 'right';
  fullscreen?: boolean;
}

interface TextBlokProps {
  blok: SbPageData;
}

const TextBlok: React.FunctionComponent<TextBlokProps> = ({ blok }) => {
  return (
    <div
      className={styles.textBlok}
      {...storyblokEditable(blok)}
      data-fullscreen={blok.fullscreen || false}
      data-align={blok.align || 'left'}
    >
      {blok.text && <Markdown content={blok.text} />}
    </div>
  );
};

export default TextBlok;
