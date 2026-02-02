'use client';

import { ISbStoryData, SbBlokData } from '@storyblok/react/rsc';
import React, { useRef, useEffect, useMemo } from 'react';
import ContentColumn from '@/components/content-column/content-column';
import styles from './index-two-column.module.sass';
import { useLayoutStore } from '@/providers/layout-store-provider';
import { useColumnParallax } from '@/hooks/useColumnParallax';
import { useStories } from '@/providers/stories-provider';
import IndexBlok from '@/components/index-blok/index-blok';
import LinkBlok from './link-blok/link-blok';

interface IndexTwoColumnProps {
  tag?: string;
  stories?: ISbStoryData[];
  blok?: SbBlokData & { tag?: string };
}

const IndexTwoColumn: React.FC<IndexTwoColumnProps> = ({ tag: tagProp, stories: storiesProp, blok }) => {
  const resolvedTag = tagProp || blok?.tag || '';
  const { stories: contextStories } = useStories();

  // Filter context stories by tag when rendered through StoryblokStory
  const allStories = useMemo(() => {
    if (storiesProp) return storiesProp;
    if (!resolvedTag) return contextStories;
    return contextStories.filter((story) =>
      story.tag_list?.some(
        (t: string) => t.toLowerCase() === resolvedTag.toLowerCase()
      )
    );
  }, [storiesProp, contextStories, resolvedTag]);
  const containerRef = useRef<HTMLDivElement>(null);
  const column1Ref = useRef<HTMLDivElement>(null);
  const column2Ref = useRef<HTMLDivElement>(null);
  const layout = useLayoutStore((state) => state.layout);
  const setLayout = useLayoutStore((state) => state.setLayout);

  // Set layout to 'two' when component mounts
  useEffect(() => {
    setLayout('twoIndex');
  }, [setLayout]);

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

  useColumnParallax({
    containerRef,
    columnRefs: [column1Ref, column2Ref],
    dependencies: [layout, column1Stories, column2Stories],
    normalizeScroll: true,
    scrollLock: true,
  });

  return (
    <div className={styles.indexTwoColumn} ref={containerRef}>
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
      <div ref={column2Ref} className="columnMedium">
        <ContentColumn>
          <LinkBlok
            tag={resolvedTag}
            stories={allStories.map((story) => ({
              title: story.content.page_title,
              tags: story.tag_list,
              link: story.full_slug,
            }))}
          />
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
    </div>
  );
};

export default IndexTwoColumn;
