import {
  SbBlokData,
  storyblokEditable,
  StoryblokServerComponent,
} from '@storyblok/react/rsc';
import React from 'react';
import ContentColumn from '@/components/content-column';

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
      <ContentColumn className="page-Home_Column">
        {blok.columnone.map((nestedBlok) => (
          <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
        ))}
      </ContentColumn>
      <ContentColumn className="page-Home_Column">
        {blok.columntwo.map((nestedBlok) => (
          <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
        ))}
      </ContentColumn>
      <ContentColumn className="page-Home_Column">
        {blok.columnthree.map((nestedBlok) => (
          <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
        ))}
      </ContentColumn>
    </div>
  );
};

export default Pagehome;
