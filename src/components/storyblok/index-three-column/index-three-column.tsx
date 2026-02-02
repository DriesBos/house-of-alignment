'use client';

import styles from './index-three-column.module.sass';
import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { ISbStoryData } from '@storyblok/react/rsc';
import ContentColumn from '@/components/content-column/content-column';
import IndexBlok from '@/components/index-blok/index-blok';
import { useLayoutStore } from '@/providers/layout-store-provider';
import { useColumnParallax } from '@/hooks/useColumnParallax';
import BlokAbout from '../blok-about/blok-about';

const IndexThreeColumn = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const column1Ref = useRef<HTMLDivElement>(null);
  const column2Ref = useRef<HTMLDivElement>(null);
  const column3Ref = useRef<HTMLDivElement>(null);
  const layout = useLayoutStore((state) => state.layout);
  const setLayout = useLayoutStore((state) => state.setLayout);
  const [allStories, setAllStories] = useState<ISbStoryData[]>([]);
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

  useColumnParallax({
    containerRef,
    columnRefs: isMobile
      ? [column1Ref, column2Ref]
      : [column1Ref, column2Ref, column3Ref],
    dependencies: [layout, allStories, isMobile],
    normalizeScroll: true,
    scrollLock: true,
  });

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
