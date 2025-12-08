'use client';

import { ISbStoryData } from '@storyblok/react/rsc';
import React, { useRef, useEffect, useState, useMemo } from 'react';
import ContentColumn from '@/components/content-column/content-column';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './index-two-column-tag.module.sass';
import { useLayoutStore } from '@/providers/layout-store-provider';
import IndexBlok from '@/components/index-blok/index-blok';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

interface IndexTwoColumnTagProps {
  tag: string;
}

const IndexTwoColumnTag: React.FC<IndexTwoColumnTagProps> = ({ tag }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const column1Ref = useRef<HTMLDivElement>(null);
  const column2Ref = useRef<HTMLDivElement>(null);
  const layout = useLayoutStore((state) => state.layout);
  const setLayout = useLayoutStore((state) => state.setLayout);

  const [allStories, setAllStories] = useState<ISbStoryData[]>([]);

  // Set layout to 'two' when component mounts
  useEffect(() => {
    setLayout('two');
  }, [setLayout]);

  // Fetch stories filtered by tag
  useEffect(() => {
    const fetchStoriesByTag = async () => {
      try {
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

  // Divide stories into two columns (60%, 40%) using weighted round-robin
  // Sort by event_date (newest first)
  const { column1Stories, column2Stories } = useMemo(() => {
    const sortedStories = [...allStories].sort((a, b) => {
      const dateA = a.content?.event_date
        ? new Date(a.content.event_date).getTime()
        : 0;
      const dateB = b.content?.event_date
        ? new Date(b.content.event_date).getTime()
        : 0;
      return dateB - dateA; // Newest first
    });

    const col1: ISbStoryData[] = [];
    const col2: ISbStoryData[] = [];

    // Weighted round-robin: pattern of 20 stories = 11 col1, 9 col2 (55%, 45%)
    // Pattern: col1, col2, col1, col2, col1, col2, col1, col2, col1, col2, col1, col2, col1, col2, col1, col2, col1, col2, col1, col1, repeat
    const pattern = [
      0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0,
    ]; // 0 = col1, 1 = col2

    sortedStories.forEach((story, index) => {
      const columnIndex = pattern[index % 20];
      if (columnIndex === 0) {
        col1.push(story);
      } else {
        col2.push(story);
      }
    });

    return {
      column1Stories: col1,
      column2Stories: col2,
    };
  }, [allStories]);

  useGSAP(
    () => {
      // Wait for content to be rendered
      if (
        !containerRef.current ||
        column1Stories.length === 0 ||
        column2Stories.length === 0
      )
        return;

      // Use requestAnimationFrame to ensure DOM is fully updated
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

        // Validate that columns have height before creating animations
        if (columnData.some((col) => col.height === 0)) return;

        // Find the longest column
        const maxHeight = Math.max(...columnData.map((col) => col.height));
        const longestColumnIndex = columnData.findIndex(
          (col) => col.height === maxHeight
        );

        // Apply animations to columns, skipping the longest one
        columnData.forEach((col, index) => {
          if (!col.ref || index === longestColumnIndex) return;

          // Calculate how many pixels this column should move
          const pixelsToMove = maxHeight - col.height;

          gsap.to(col.ref, {
            y: pixelsToMove,
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });
        });
      });
    },
    {
      scope: containerRef,
      dependencies: [layout, column1Stories, column2Stories],
      revertOnUpdate: true,
    }
  );

  return (
    <div className={styles.indexTwoColumn} ref={containerRef}>
      <div ref={column1Ref} className="columnMedium">
        <ContentColumn>
          {column1Stories.map((item) => (
            <IndexBlok
              key={item.uuid}
              title={item.content.page_title}
              image={item.content.page_image}
              quote={item.content.page_quote}
              tags={item.tag_list}
              seats={item.content.chairs}
              link={item.full_slug}
            />
          ))}
        </ContentColumn>
      </div>
      <div ref={column2Ref} className="columnMedium">
        <ContentColumn>
          {column2Stories.map((item) => (
            <IndexBlok
              key={item.uuid}
              title={item.content.page_title}
              image={item.content.page_image}
              quote={item.content.page_quote}
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
