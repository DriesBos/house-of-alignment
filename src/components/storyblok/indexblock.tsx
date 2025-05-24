import { SbBlokData, storyblokEditable } from '@storyblok/react/rsc';
import React from 'react';
import Image from 'next/image';
import type { StaticImport } from 'next/dist/shared/lib/get-img-props';

interface SbIndexBlockData extends SbBlokData {
  title?: string;
  text?: string;
  thumbnail?: {
    filename: string | StaticImport;
    alt?: string;
  };
  link?: object;
}

interface IndexBlockProps {
  blok: SbIndexBlockData;
}

const IndexBlock: React.FunctionComponent<IndexBlockProps> = ({ blok }) => {
  console.log('IndexBlock', blok);
  return (
    <div {...storyblokEditable(blok)} className="indexBlock">
      <div className="imageContainer">
        {blok.thumbnail && (
          <Image
            src={blok.thumbnail.filename}
            alt={blok.thumbnail.alt ?? ''}
            width={0}
            height={0}
            sizes="100vw"
          />
        )}
      </div>
      {blok.title && <div>{blok.title}</div>}
      {blok.text && <div>{blok.text}</div>}
    </div>
  );
};

export default IndexBlock;
