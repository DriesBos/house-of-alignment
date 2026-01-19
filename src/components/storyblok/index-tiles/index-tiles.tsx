'use client';

import { ISbStoryData } from '@storyblok/react/rsc';
import React, { useRef, useEffect, useState } from 'react';
import styles from './index-tiles.module.sass';
import { useLayoutStore } from '@/providers/layout-store-provider';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';


const IndexTiles: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const setLayout = useLayoutStore((state) => state.setLayout);
  const [allStories, setAllStories] = useState<ISbStoryData[]>([]);
  const tag = 'mentorship';

  // GSAP animation for mouse-based grid row adjustment
  useGSAP(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Calculate normalized positions (0 to 1)
      const normalizedX = mouseX / rect.width;
      const normalizedY = mouseY / rect.height;
      
      // Map normalized Y position to row percentages
      // 0 (top) = 55% 45%, 1 (bottom) = 45% 55%
      const row1Percent = 55 - (normalizedY * 10);
      const row2Percent = 45 + (normalizedY * 10);

      // Map normalized X position to column widths (flipped)
      // 0 (left) = 25vw 30vw 20vw 25vw, 1 (right) = 25vw 20vw 30vw 25vw
      const col2Width = 30 - (normalizedX * 10);
      const col3Width = 20 + (normalizedX * 10);

      // Animate grid based on mouse position
      gsap.to(gridRef.current, {
        '--grid-rows-1': `${row1Percent}%`,
        '--grid-rows-2': `${row2Percent}%`,
        '--grid-col-2': `${col2Width}vw`,
        '--grid-col-3': `${col3Width}vw`,
        duration: 0,
        // ease: 'power2.out',
      });
    };

    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, { scope: containerRef });

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
        <div className={styles.indexTiles_Grid} ref={gridRef}>
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
