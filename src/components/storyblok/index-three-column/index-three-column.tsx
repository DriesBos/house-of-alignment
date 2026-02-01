'use client';

import styles from './index-three-column.module.sass';
import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
} from 'react';
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
  const [isScrollReady, setIsScrollReady] = useState(false);

  // Set layout to 'three' when component mounts
  useEffect(() => {
    setLayout('three');
  }, [setLayout]);

  // Prevent scrolling until ScrollTrigger is ready
  useEffect(() => {
    const storeDataWrapper = document.querySelector(
      '.storeDataWrapper'
    ) as HTMLElement;
    if (!storeDataWrapper) return;

    if (!isScrollReady) {
      storeDataWrapper.style.overflow = 'hidden';
    } else {
      storeDataWrapper.style.overflow = 'auto';
    }

    return () => {
      storeDataWrapper.style.overflow = 'auto';
    };
  }, [isScrollReady]);

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

  // Divide stories into three columns (40%, 40%, 20%) using weighted round-robin
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

    const col1: ISbStoryData[] = [];
    const col2: ISbStoryData[] = [];
    const col3: ISbStoryData[] = [];

    // Weighted round-robin: pattern of 8 stories = 3 col1, 3 col2, 2 col3 (37.5%, 37.5%, 25%)
    // Pattern: col1, col2, col3, col1, col2, col1, col2, col3, repeat
    const pattern = [0, 1, 2, 0, 1, 0, 1, 2]; // 0 = col1, 1 = col2, 2 = col3

    storiesWithTags.forEach((story, index) => {
      const columnIndex = pattern[index % 5];
      if (columnIndex === 0) {
        col1.push(story);
      } else if (columnIndex === 1) {
        col2.push(story);
      } else {
        col3.push(story);
      }
    });

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

      const scroller = document.querySelector(
        '.storeDataWrapper'
      ) as HTMLElement | null;
      if (!scroller) return;

      // Use requestAnimationFrame to ensure DOM is fully updated
      requestAnimationFrame(() => {
        // Normalize scroll for Safari (handles touch + scroll inconsistencies)
        // Scope it to the custom scroller to avoid Window-based errors.
        ScrollTrigger.normalizeScroll({
          target: scroller,
          allowNestedScroll: true,
          lockAxis: false,
          type: 'touch,wheel,pointer',
        });

        // Set up ScrollTrigger default configuration
        ScrollTrigger.defaults({
          scroller,
        });

        // Get column heights - column 1 (left) is longest and scrolls normally
        const column1Height = column1Ref.current?.offsetHeight || 0;
        const column2Height = column2Ref.current?.offsetHeight || 0;
        const column3Height = column3Ref.current?.offsetHeight || 0;

        // Validate that columns have height before creating animations
        if (!column1Height || !column2Height || !column3Height) return;

        // Column 1 is the anchor (longest, scrolls normally, determines container height)
        // Columns 2 & 3 animate to catch up by scrolling slower (translate down)
        const animatedColumns = [
          { ref: column2Ref.current, height: column2Height },
          { ref: column3Ref.current, height: column3Height },
        ];

        animatedColumns.forEach((col) => {
          if (!col.ref) return;

          // Calculate pixels to move down relative to column 1 (positive = slower scroll)
          const pixelsToMove = column1Height - col.height;

          // Skip if heights are exactly equal
          if (pixelsToMove === 0) return;

          gsap.to(col.ref, {
            y: pixelsToMove,
            ease: 'none',
            force3D: true,
            willChange: 'transform',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        });

        // Enable scrolling after ScrollTrigger is set up
        setIsScrollReady(true);
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
