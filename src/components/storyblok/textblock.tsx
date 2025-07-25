'use client';

import { SbBlokData, storyblokEditable } from '@storyblok/react/rsc';

interface SbPageData extends SbBlokData {
  text?: string;
}

interface TextBlockProps {
  blok: SbPageData;
}

const TextBlock: React.FunctionComponent<TextBlockProps> = ({ blok }) => {
  return (
    <div className="column column-Text" {...storyblokEditable(blok)}>
      <h1>TEXTBLOCK</h1>
      {blok.text}
    </div>
  );
};

export default TextBlock;
