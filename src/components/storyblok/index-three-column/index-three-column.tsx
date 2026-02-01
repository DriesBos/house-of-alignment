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
  const [isMobile, setIsMobile] = useState(false);

  // Track window size for responsive column layout
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 770);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

      // SAFETY: Force scroll restoration after 2000ms if initialization fails
      const safetyTimeout = setTimeout(() => {
        setIsScrollReady(true);
      }, 2000);

      return () => {
        clearTimeout(safetyTimeout);
        storeDataWrapper.style.overflow = 'auto';
      };
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

  // Divide stories into columns using weighted round-robin
  // Only include stories that have at least one tag
  // Sort by event_date (newest first)
  // Mobile (<770px): 2 columns, Desktop: 3 columns
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

    if (isMobile) {
      // Two-column distribution (55%, 45%)
      const pattern = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0];
      storiesWithTags.forEach((story, index) => {
        const columnIndex = pattern[index % 20];
        if (columnIndex === 0) {
          col1.push(story);
        } else {
          col2.push(story);
        }
      });
    } else {
      // Three-column distribution (37.5%, 37.5%, 25%)
      const pattern = [0, 1, 2, 0, 1, 0, 1, 2];
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
    }

    return {
      column1Stories: col1,
      column2Stories: col2,
      column3Stories: col3,
    };
  }, [allStories, isMobile]);

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
        try {
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

          // Build column data based on current layout mode
          const columnData = isMobile
            ? [
                { ref: column1Ref.current, height: column1Ref.current?.offsetHeight || 0 },
                { ref: column2Ref.current, height: column2Ref.current?.offsetHeight || 0 },
              ]
            : [
                { ref: column1Ref.current, height: column1Ref.current?.offsetHeight || 0 },
                { ref: column2Ref.current, height: column2Ref.current?.offsetHeight || 0 },
                { ref: column3Ref.current, height: column3Ref.current?.offsetHeight || 0 },
              ];

          // Validate that columns have height before creating animations
          if (columnData.some((col) => col.height === 0)) {
            console.warn(
              'Columns have no height - enabling scroll without animation'
            );
            setIsScrollReady(true);
            return;
          }

          // Find the longest column - it scrolls normally, others animate to catch up
          const maxHeight = Math.max(...columnData.map((col) => col.height));
          const longestColumnIndex = columnData.findIndex(
            (col) => col.height === maxHeight
          );

          columnData.forEach((col, index) => {
            if (!col.ref || index === longestColumnIndex) return;

            const pixelsToMove = maxHeight - col.height;
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
        } catch (error) {
          console.error('ScrollTrigger initialization failed:', error);
          // CRITICAL: Enable scrolling even if animation fails
          setIsScrollReady(true);
        }
      });
    },
    {
      scope: containerRef,
      dependencies: [layout, allStories, isMobile],
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
        {!isMobile && (
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
        )}
      </div>
    </>
  );
};

export default IndexThreeColumn;
