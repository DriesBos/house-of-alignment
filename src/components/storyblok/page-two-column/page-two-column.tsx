'use client';

import {
  SbBlokData,
  storyblokEditable,
  StoryblokServerComponent,
} from '@storyblok/react/rsc';
import React, { useRef, useLayoutEffect, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ContentColumn from '@/components/content-column/content-column';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import styles from './page-two-column.module.sass';
import { useLayoutStore } from '@/providers/layout-store-provider';

// Make sure GSAP plugins are registered before any animations
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface SbPageTwoColumnData extends SbBlokData {
  column_one: SbBlokData[];
  column_two: SbBlokData[];
}

interface PageTwoColumnProps {
  blok: SbPageTwoColumnData;
}

const PageTwoColumn: React.FunctionComponent<PageTwoColumnProps> = ({
  blok,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const column1Ref = useRef<HTMLDivElement>(null);
  const column2Ref = useRef<HTMLDivElement>(null);
  const layout = useLayoutStore((state) => state.layout);
  const setLayout = useLayoutStore((state) => state.setLayout);
  const pathname = usePathname();

  // Set layout to 'two' when component mounts
  useEffect(() => {
    setLayout('two');
  }, [setLayout]);

  // Handle anchor scrolling after navigation
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const id = window.location.hash.substring(1);
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [pathname]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    if (window.matchMedia('(max-width: 770px)').matches) return;

    const triggers: ScrollTrigger[] = [];

    requestAnimationFrame(() => {
      ScrollTrigger.defaults({
        scroller: '.storeDataWrapper',
      });

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

      const maxHeight = Math.max(...columnData.map((col) => col.height));
      const longestColumnIndex = columnData.findIndex(
        (col) => col.height === maxHeight
      );

      columnData.forEach((col, index) => {
        if (!col.ref || index === longestColumnIndex) return;

        const pixelsToMove = maxHeight - col.height;

        const tl = gsap.to(col.ref, {
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

        if (tl.scrollTrigger) {
          triggers.push(tl.scrollTrigger);
        }
      });
    });

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [layout]);

  return (
    <div
      className={styles.pageTwoColumn}
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
    </div>
  );
};

export default PageTwoColumn;
