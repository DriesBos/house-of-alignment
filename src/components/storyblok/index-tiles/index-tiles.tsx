'use client';

import { ISbStoryData } from '@storyblok/react/rsc';
import React, { useRef, useEffect, useState } from 'react';
import ContentColumn from '@/components/content-column/content-column';
import styles from './index-tiles.module.sass';
import { useLayoutStore } from '@/providers/layout-store-provider';
import IndexBlok from '@/components/index-blok/index-blok';

interface IndexTilesProps {
  tag: string;
}

const IndexTiles: React.FC<IndexTilesProps> = ({ tag }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const setLayout = useLayoutStore((state) => state.setLayout);
  const [allStories, setAllStories] = useState<ISbStoryData[]>([]);

  // Set layout to 'tiles' when component mounts
  useEffect(() => {
    setLayout('one');
  }, [setLayout]);

  // Fetch stories filtered by tag
  useEffect(() => {
    const fetchStoriesByTag = async () => {
      try {
        if (!tag) {
          console.warn('Tag is empty or undefined');
          return;
        }

        const response = await fetch(
          `https://api.storyblok.com/v2/cdn/stories?version=published&with_tag=${tag}&token=${process.env.NEXT_PUBLIC_STORYBLOK_TOKEN}`
        );
        const data = await response.json();
        setAllStories(data.stories || []);
      } catch (error) {
        console.error('Error fetching stories by tag:', error);
      }
    };

    fetchStoriesByTag();
  }, [tag]);

  console.log("STORIES", allStories, allStories.length);
  console.log("TAG", tag);

  return (
    <div className={styles.indexTiles} ref={containerRef}>
      <ContentColumn>
        <div className={styles.tilesGrid}>
          {allStories.map((item) => (
            <IndexBlok
              key={item.uuid}
              title={item.content.page_title}
              descr={item.content.page_descr}
              image={item.content.page_image}
              quote={item.content.page_quote}
              tags={item.tag_list}
              event_date={item.content.event_date}
              seats={item.content.chairs}
              link={item.full_slug}
            />
          ))}
        </div>
      </ContentColumn>
    </div>
  );
};

export default IndexTiles;
