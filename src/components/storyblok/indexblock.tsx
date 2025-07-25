import { SbBlokData, storyblokEditable } from '@storyblok/react/rsc';
import React, { useMemo } from 'react';
import Image from 'next/image';
import type { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { useLayoutStore } from '@/providers/layout-store-provider';

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
  const layout = useLayoutStore((state) => state.layout);

  // console.log('IndexBlock', blok);

  const sizes = useMemo(() => {
    if (layout === 'one') {
      return '100vw';
    } else if (layout === 'two') {
      return '50vw';
    } else if (layout === 'three') {
      return '50vw, 25vw';
    }
    return '100vw'; // default fallback
  }, [layout]);

  return (
    <div {...storyblokEditable(blok)} className="indexBlock">
      <div className="imageContainer">
        {blok.thumbnail && (
          <>
            <div className="imageHoverLayer">
              <div className="imageHoverLayer_block" />
            </div>
            <Image
              alt={blok.thumbnail.alt ?? ''}
              src={blok.thumbnail.filename}
              width={0}
              height={0}
              sizes={sizes}
              quality={40}
              loading="eager"
              priority={true}
              className="imageLoad"
              onLoad={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            />
          </>
        )}
      </div>
      {blok.title && <div>{blok.title}</div>}
      {blok.text && <div>{blok.text}</div>}
    </div>
  );
};

export default IndexBlock;
