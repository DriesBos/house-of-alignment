'use client';

import IndexBlokGeneral from './index-blok-general/index-blok-general';
import IndexBlokfounderstories from './index-blok-founderstories/index-blok-founderstories';

interface IndexBlokProps {
  title?: string;
  descr?: string;
  image?: object & {
    filename: string;
    alt?: string;
  };
  link?: string;
  quote?: string;
  tags?: Array<string>;
  event_date?: string;
  seats?: number;
}

export default function IndexBlok({
  title,
  descr,
  image,
  link,
  quote,
  tags,
  event_date,
  seats,
}: IndexBlokProps) {
  // Determine if event is active (in the future)
  const isActive = event_date ? new Date(event_date) > new Date() : false;

  // Check if item has 'founderstories' tag (case-insensitive)
  const isfounderstories = tags?.some(
    (tag) => tag.toLowerCase() === 'founderstories',
  );

  if (isfounderstories) {
    return (
      <IndexBlokfounderstories
        title={title}
        descr={descr}
        image={image}
        link={link}
        quote={quote}
        tags={tags}
        event_date={event_date}
        isActive={isActive}
      />
    );
  }

  return (
    <IndexBlokGeneral
      title={title}
      image={image}
      link={link}
      quote={quote}
      tags={tags}
      event_date={event_date}
      seats={seats}
      isActive={isActive}
    />
  );
}
