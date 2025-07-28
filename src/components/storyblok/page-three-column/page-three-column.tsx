'use client';

import {
  SbBlokData,
  storyblokEditable,
  StoryblokServerComponent,
} from '@storyblok/react/rsc';
import React, { useRef, useLayoutEffect, useEffect } from 'react';
import ContentColumn from '@/components/content-column';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import styles from './page-three-column.module.sass';
import { useLayoutStore } from '@/providers/layout-store-provider';

// Make sure GSAP plugins are registered before any animations
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface SbPageThreeColumnData extends SbBlokData {
  column_one: SbBlokData[];
  column_two: SbBlokData[];
  column_three: SbBlokData[];
}

interface PageThreeColumnProps {
  blok: SbPageThreeColumnData;
}

const PageThreeColumn: React.FunctionComponent<PageThreeColumnProps> = ({
  blok,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const column1Ref = useRef<HTMLDivElement>(null);
  const column2Ref = useRef<HTMLDivElement>(null);
  const column3Ref = useRef<HTMLDivElement>(null);
  const layout = useLayoutStore((state) => state.layout);
  const setLayout = useLayoutStore((state) => state.setLayout);

  // Set layout to 'three' when component mounts
  useEffect(() => {
    setLayout('three');
  }, [setLayout]);

  useLayoutEffect(() => {
    // Make sure we have access to the DOM elements
    if (!containerRef.current) return;

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

    console.log('ColumnData', columnData);

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

    // Cleanup function
    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [layout]); // Empty dependency array since we only want this to run once

  return (
    <div
      className={styles.pageThreeColumn}
      {...storyblokEditable(blok)}
      ref={containerRef}
    >
      <div ref={column1Ref}>
        <ContentColumn>
          {blok.column_one.map((nestedBlok) => (
            <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
          ))}
        </ContentColumn>
      </div>
      <div ref={column2Ref}>
        <ContentColumn>
          {blok.column_two.map((nestedBlok) => (
            <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
          ))}
        </ContentColumn>
      </div>
      <div ref={column3Ref}>
        <ContentColumn>
          {blok.column_three.map((nestedBlok) => (
            <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
          ))}
        </ContentColumn>
      </div>
    </div>
  );
};

export default PageThreeColumn;
