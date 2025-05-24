import {
  SbBlokData,
  storyblokEditable,
  StoryblokServerComponent,
} from '@storyblok/react/rsc';
import React from 'react';

interface SbPageData extends SbBlokData {
  body: SbBlokData[];
}

interface PageProps {
  blok: SbPageData;
}

const Page: React.FunctionComponent<PageProps> = ({ blok }) => {
  return (
    <div {...storyblokEditable(blok)}>
      {blok.body.map((nestedBlok) => (
        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  );
};

export default Page;
