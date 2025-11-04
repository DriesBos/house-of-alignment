'use client';

import { ISbStoryData } from '@storyblok/react/rsc';
import React, { useRef, useEffect, useState } from 'react';
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

  const [columnOne, setColumnOne] = useState<ISbStoryData[]>([]);
  const [columnTwo, setColumnTwo] = useState<ISbStoryData[]>([]);

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

        // Split into two arrays: even indices in columnOne, odd indices in columnTwo
        const evenStories = data.stories.filter(
          (_: ISbStoryData, index: number) => index % 2 === 0
        );
        const oddStories = data.stories.filter(
          (_: ISbStoryData, index: number) => index % 2 === 1
        );

        setColumnOne(evenStories);
        setColumnTwo(oddStories);
      } catch (error) {
        console.error('Error fetching stories by tag:', error);
      }
    };

    fetchStoriesByTag();
  }, [tag]);

  useGSAP(
    () => {
      // Wait for content to be rendered
      if (
        !containerRef.current ||
        columnOne.length === 0 ||
        columnTwo.length === 0
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
      dependencies: [layout, columnOne, columnTwo],
      revertOnUpdate: true,
    }
  );

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
