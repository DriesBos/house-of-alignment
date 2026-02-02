'use client';

import {
  SbBlokData,
  storyblokEditable,
  StoryblokServerComponent,
} from '@storyblok/react/rsc';
import React, { useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ContentColumn from '@/components/content-column/content-column';
import styles from './page-two-column.module.sass';
import { useLayoutStore } from '@/providers/layout-store-provider';
import { useColumnParallax } from '@/hooks/useColumnParallax';

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

  useColumnParallax({
    containerRef,
    columnRefs: [column1Ref, column2Ref],
    dependencies: [layout],
    skipOnMobile: true,
  });

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
