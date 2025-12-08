'use client';

import styles from './index-three-column.module.sass';
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { ISbStoryData } from '@storyblok/react/rsc';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ContentColumn from '@/components/content-column/content-column';
import IndexBlok from '@/components/index-blok/index-blok';
import { useLayoutStore } from '@/providers/layout-store-provider';
import BlokAbout from '../blok-about/blok-about';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

const IndexThreeColumn = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const column1Ref = useRef<HTMLDivElement>(null);
  const column2Ref = useRef<HTMLDivElement>(null);
  const column3Ref = useRef<HTMLDivElement>(null);
  const layout = useLayoutStore((state) => state.layout);
  const setLayout = useLayoutStore((state) => state.setLayout);
  const [allStories, setAllStories] = useState<ISbStoryData[]>([]);

  // Set layout to 'three' when component mounts
  useEffect(() => {
    setLayout('three');
  }, [setLayout]);

  // Fetch all stories
  useEffect(() => {
    const fetchAllStories = async () => {
      try {
        const response = await fetch(
          `https://api.storyblok.com/v2/cdn/stories?version=published&token=${process.env.NEXT_PUBLIC_STORYBLOK_TOKEN}`
        );
        const data = await response.json();
        setAllStories(data.stories);
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };

    fetchAllStories();
  }, []);

  // Divide stories into three columns (40%, 40%, 20%)
  // Only include stories that have at least one tag
  // Sort by event_date (newest first)
  const { column1Stories, column2Stories, column3Stories } = useMemo(() => {
    const storiesWithTags = allStories
      .filter((story) => story.tag_list && story.tag_list.length > 0)
      .sort((a, b) => {
        const dateA = a.content?.event_date
          ? new Date(a.content.event_date).getTime()
          : 0;
        const dateB = b.content?.event_date
          ? new Date(b.content.event_date).getTime()
          : 0;
        return dateB - dateA; // Newest first
      });

    const total = storiesWithTags.length;
    const col1Count = Math.round(total * 0.38);
    const col2Count = Math.round(total * 0.37);
    // col3 gets the remaining stories

    const col1 = storiesWithTags.slice(0, col1Count);
    const col2 = storiesWithTags.slice(col1Count, col1Count + col2Count);
    const col3 = storiesWithTags.slice(col1Count + col2Count);

    return {
      column1Stories: col1,
      column2Stories: col2,
      column3Stories: col3,
    };
  }, [allStories]);

  useGSAP(
    () => {
      // Wait for content to be rendered
      if (!containerRef.current || allStories.length === 0) return;

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
          {
            ref: column3Ref.current,
            height: column3Ref.current?.offsetHeight || 0,
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
      dependencies: [layout, allStories],
      revertOnUpdate: true,
    }
  );

  return (
    <>
      <BlokAbout />
      <div
        className={`${styles.indexThreeColumn} indexThreeColumn`}
        ref={containerRef}
      >
        <div ref={column1Ref} className="columnMedium">
          <ContentColumn>
            {column1Stories.map((item) => (
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
          </ContentColumn>
        </div>
        <div ref={column2Ref} className="columnSmall">
          <ContentColumn>
            {column2Stories.map((item) => (
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
          </ContentColumn>
        </div>
        <div ref={column3Ref} className="columnSmall">
          <ContentColumn>
            {column3Stories.map((item) => (
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
          </ContentColumn>
        </div>
      </div>
    </>
  );
};

export default IndexThreeColumn;
