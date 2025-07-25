import { StoryblokServerComponent, SbBlokData } from '@storyblok/react/rsc';

interface SbContentBlockData extends SbBlokData {
  body: SbBlokData[];
}

interface ContentBlockProps {
  blok: SbContentBlockData;
}

export default function ContentBlock({ blok }: ContentBlockProps) {
  console.log('ContentBlock', blok.body);
  return (
    <div className="contentBlock">
      {blok.body?.map((nestedBlok) => (
        <>
          <h1>CONTENTBLOCK</h1>
          <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
        </>
      ))}
    </div>
  );
}
