import {
  SbBlokData,
  storyblokEditable,
  StoryblokServerComponent,
} from '@storyblok/react/rsc';
import React from 'react';

interface SbPagehomeData extends SbBlokData {
  columnone: SbBlokData[];
  columntwo: SbBlokData[];
  columnthree: SbBlokData[];
}

interface PagehomeProps {
  blok: SbPagehomeData;
}

const Pagehome: React.FunctionComponent<PagehomeProps> = ({ blok }) => {
  console.log('Pagehome blok:', blok);
  return (
    <div className="page page-Home" {...storyblokEditable(blok)}>
      <div className="page-Home_Column">
        {blok.columnone.map((nestedBlok) => (
          <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
        ))}
      </div>
      <div className="page-Home_Column">
        {blok.columntwo.map((nestedBlok) => (
          <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
        ))}
      </div>
      <div className="page-Home_Column">
        {blok.columnthree.map((nestedBlok) => (
          <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
        ))}
      </div>
    </div>
  );
};

export default Pagehome;
