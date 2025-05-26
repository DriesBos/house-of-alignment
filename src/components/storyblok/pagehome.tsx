'use client';

import {
  SbBlokData,
  storyblokEditable,
  StoryblokServerComponent,
} from '@storyblok/react/rsc';
import React, { useRef, useLayoutEffect } from 'react';
import ContentColumn from '@/components/content-column';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import styles from './pagehome.module.sass';

// Make sure GSAP plugins are registered before any animations
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface SbPagehomeData extends SbBlokData {
  columnone: SbBlokData[];
  columntwo: SbBlokData[];
  columnthree: SbBlokData[];
}

interface PagehomeProps {
  blok: SbPagehomeData;
}

const Pagehome: React.FunctionComponent<PagehomeProps> = ({ blok }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const column1Ref = useRef<HTMLDivElement>(null);
  const column2Ref = useRef<HTMLDivElement>(null);
  const column3Ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // Make sure we have access to the DOM elements
    if (!containerRef.current) return;

    // Set up ScrollTrigger default configuration
    ScrollTrigger.defaults({
      scroller: '.storeDataWrapper',
    });

    // Get all column references and their heights
    const columnData = [
      { ref: column1Ref.current, height: column1Ref.current?.offsetHeight || 0 },
      { ref: column2Ref.current, height: column2Ref.current?.offsetHeight || 0 },
      { ref: column3Ref.current, height: column3Ref.current?.offsetHeight || 0 },
    ];

    // Find the longest column
    const maxHeight = Math.max(...columnData.map(col => col.height));
    const longestColumnIndex = columnData.findIndex(col => col.height === maxHeight);

    // Calculate relative speeds based on column heights
    // Columns shorter than the longest will move faster (positive speed)
    // The longest column will have speed 0 (no movement)
    const columns = columnData.map((col, index) => ({
      ref: col.ref,
      speed: index === longestColumnIndex ? 0 : (maxHeight - col.height) / maxHeight
    }));

    console.log('Column heights:', columnData.map(col => col.height));
    console.log('Calculated speeds:', columns.map(col => col.speed));

    // Create an array to store our ScrollTrigger instances
    const triggers: ScrollTrigger[] = [];

    columns.forEach(({ ref, speed }) => {
      if (!ref || speed === 0) return; // Skip the longest column

      const tl = gsap.to(ref, {
        y: `${speed * -100}%`,
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
  }, []); // Empty dependency array since we only want this to run once

  return (
    <div
      className={`${styles.pageHome} page-Home`}
      {...storyblokEditable(blok)}
      ref={containerRef}
    >
      <div className={styles.pageHome_column} ref={column1Ref}>
        <ContentColumn>
          {blok.columnone.map((nestedBlok) => (
            <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
          ))}
        </ContentColumn>
      </div>
      <div className={styles.pageHome_column} ref={column2Ref}>
        <ContentColumn>
          {blok.columntwo.map((nestedBlok) => (
            <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
          ))}
        </ContentColumn>
      </div>
      <div className={styles.pageHome_column} ref={column3Ref}>
        <ContentColumn>
          {blok.columnthree.map((nestedBlok) => (
            <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
          ))}
        </ContentColumn>
      </div>
    </div>
  );
};

export default Pagehome;
