'use client';

import { ISbStoryData } from '@storyblok/react/rsc';
import React, { useRef, useLayoutEffect, useEffect, useState } from 'react';
import ContentColumn from '@/components/content-column/content-column';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import styles from './index-two-column-tag.module.sass';
import { useLayoutStore } from '@/providers/layout-store-provider';
import IndexBlok from '@/components/index-blok/index-blok';

// Make sure GSAP plugins are registered before any animations
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface IndexTwoColumnTagProps {
  tag: string;
}

const IndexTwoColumnTag: React.FC<IndexTwoColumnTagProps> = ({ tag }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const column1Ref = useRef<HTMLDivElement>(null);
  const column2Ref = useRef<HTMLDivElement>(null);
  const layout = useLayoutStore((state) => state.layout);
  const setLayout = useLayoutStore((state) => state.setLayout);

  const [columnOne, setColumnOne] = useState<ISbStoryData[]>([]);
  const [columnTwo, setColumnTwo] = useState<ISbStoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Set layout to 'two' when component mounts
  useEffect(() => {
    setLayout('two');
  }, [setLayout]);

  // Fetch stories filtered by tag
  useEffect(() => {
    const fetchStoriesByTag = async () => {
      try {
        setIsLoading(true);

        // Convert URL-friendly slug to properly formatted tag
        // Replace '-' and '_' with spaces, then capitalize each word
        const tagName = tag
          .replace(/[-_]/g, ' ')
          .split(' ')
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(' ');

        console.log('Fetching stories for tag:', tagName);

        const response = await fetch(
          `https://api.storyblok.com/v2/cdn/stories?version=published&with_tag=${tagName}&token=${process.env.NEXT_PUBLIC_STORYBLOK_TOKEN}`
        );
        const data = await response.json();

        console.log('Stories with tag:', data.stories);

        // Split into two arrays: even indices in columnOne, odd indices in columnTwo
        const evenStories = data.stories.filter(
          (_: ISbStoryData, index: number) => index % 2 === 0
        );
        const oddStories = data.stories.filter(
          (_: ISbStoryData, index: number) => index % 2 === 1
        );

        setColumnOne(evenStories);
        setColumnTwo(oddStories);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching stories by tag:', error);
        setIsLoading(false);
      }
    };

    fetchStoriesByTag();
  }, [tag]);

  useLayoutEffect(() => {
    // Wait for content to be rendered
    if (
      !containerRef.current ||
      columnOne.length === 0 ||
      columnTwo.length === 0
    )
      return;

    // Use requestAnimationFrame to ensure DOM is fully updated
    const setupScrollTrigger = () => {
      requestAnimationFrame(() => {
        // Set up ScrollTrigger default configuration
        ScrollTrigger.defaults({
          scroller: '.storeDataWrapper',
        });

        // Get all column references and their heights
        const columnData = [
          {
            ref: column1Ref.current,
            height: column1Ref.current?.offsetHeight || 0,
          },
          {
            ref: column2Ref.current,
            height: column2Ref.current?.offsetHeight || 0,
          },
        ];

        // Check if all heights are valid (not zero)
        const hasValidHeights = columnData.every((col) => col.height > 0);
        if (!hasValidHeights) {
          console.warn(
            'Column heights are still 0, waiting for content to render'
          );
          return;
        }

        // Find the longest column
        const maxHeight = Math.max(...columnData.map((col) => col.height));
        const longestColumnIndex = columnData.findIndex(
          (col) => col.height === maxHeight
        );

        // Create an array to store our ScrollTrigger instances
        const triggers: ScrollTrigger[] = [];

        // Apply animations to columns, skipping the longest one
        columnData.forEach((col, index) => {
          if (!col.ref || index === longestColumnIndex) return;

          // Calculate how many pixels this column should move (negative for slower movement)
          const pixelsToMove = maxHeight - col.height;

          const tl = gsap.to(col.ref, {
            y: pixelsToMove,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,
              invalidateOnRefresh: true,
            },
          });

          if (tl.scrollTrigger) {
            triggers.push(tl.scrollTrigger);
          }
        });

        // Store cleanup function
        return () => {
          triggers.forEach((trigger) => trigger.kill());
        };
      });
    };

    setupScrollTrigger();

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [layout, columnOne, columnTwo]); // Run when stories are loaded

  // Format tag for display
  const displayTag = tag
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  if (isLoading) {
    return (
      <div className={styles.indexTwoColumn} ref={containerRef}>
        <h1>Loading posts tagged with &quot;{displayTag}&quot;...</h1>
      </div>
    );
  }

  console.log(columnOne, columnTwo);

  return (
    <div className={styles.indexTwoColumn} ref={containerRef}>
      <div ref={column1Ref}>
        <ContentColumn>
          {columnOne.map((item) => (
            <IndexBlok
              key={item.uuid}
              title={item.content.page_title}
              image={item.content.page_image}
              tags={item.tag_list}
              seats={item.content.chairs}
              link={item.full_slug}
            />
          ))}
        </ContentColumn>
      </div>
      <div ref={column2Ref}>
        <ContentColumn>
          {columnTwo.map((item) => (
            <IndexBlok
              key={item.uuid}
              title={item.content.page_title}
              image={item.content.page_image}
              tags={item.tag_list}
              seats={item.content.chairs}
              link={item.full_slug}
            />
          ))}
        </ContentColumn>
      </div>
    </div>
  );
};

export default IndexTwoColumnTag;
