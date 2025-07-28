'use client';

import { SbBlokData, storyblokEditable } from '@storyblok/react/rsc';

interface SbPageData extends SbBlokData {
  text?: string;
}

interface TextBlokProps {
  blok: SbPageData;
}

const TextBlok: React.FunctionComponent<TextBlokProps> = ({ blok }) => {
  console.log('TextBlok', blok);

  return (
    <div className="column column-Text" {...storyblokEditable(blok)}>
      {blok.text}
    </div>
  );
};

export default TextBlok;
