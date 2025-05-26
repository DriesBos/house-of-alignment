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

    const columns = [
      { ref: column1Ref.current, speed: 0.3 },
      { ref: column2Ref.current, speed: 0.6 },
      { ref: column3Ref.current, speed: 0.9 },
    ];

    // Create an array to store our ScrollTrigger instances
    const triggers: ScrollTrigger[] = [];

    columns.forEach(({ ref, speed }) => {
      if (!ref) return;

      const tl = gsap.to(ref, {
        y: `${speed * -100}%`, // Using y instead of top for better performance
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
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
