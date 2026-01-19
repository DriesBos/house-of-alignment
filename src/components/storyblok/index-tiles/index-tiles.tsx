'use client';

import { ISbStoryData } from '@storyblok/react/rsc';
import React, { useRef, useEffect, useState } from 'react';
import styles from './index-tiles.module.sass';
import { useLayoutStore } from '@/providers/layout-store-provider';
import Link from 'next/link';


const IndexTiles: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const setLayout = useLayoutStore((state) => state.setLayout);
  const [allStories, setAllStories] = useState<ISbStoryData[]>([]);
  const tag = 'mentorship';

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

        // Convert URL-friendly slug to properly formatted tag
        // Replace '-' and '_' with spaces, then capitalize each word
        const tagName = tag
          .replace(/[-_]/g, ' ')
          .split(' ')
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(' ');

        const response = await fetch(
          `https://api.storyblok.com/v2/cdn/stories?version=published&with_tag=${tagName}&token=${process.env.NEXT_PUBLIC_STORYBLOK_TOKEN}`
        );
        const data = await response.json();
        setAllStories(data.stories || []);
      } catch (error) {
        console.error('Error fetching stories by tag:', error);
      }
    };

    fetchStoriesByTag();
  }, [tag]);

  return (
    <div className={styles.indexTiles} ref={containerRef}>
        <div className={styles.indexTiles_Grid}>
          {allStories.map((item) => (
            <Link href={item.full_slug} key={item.uuid} className={styles.indexTiles_Tile}>

              <h1>{item.content.page_title}</h1>
              <p>{item.content.page_descr}</p>
            </Link>
          ))}
        </div>
    </div>
  );
};

export default IndexTiles;
