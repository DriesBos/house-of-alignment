'use client';

import {
  SbBlokData,
  storyblokEditable,
  StoryblokServerComponent,
} from '@storyblok/react/rsc';
import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import styles from './page.module.sass';
import { useLayoutStore } from '@/providers/layout-store-provider';
import ByeBlok from '@/components/bye-blok/bye-blok';

interface SbPageData extends SbBlokData {
  body: SbBlokData[];
}

interface PageProps {
  blok: SbPageData;
}

const Page: React.FunctionComponent<PageProps> = ({ blok }) => {
  const setLayout = useLayoutStore((state) => state.setLayout);
  const pathname = usePathname();

  // Set layout to 'one' when component mounts
  useEffect(() => {
    setLayout('one');
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

  return (
    <div className={styles.page} {...storyblokEditable(blok)}>
      {blok.body.map((nestedBlok) => (
        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
      <ByeBlok />
    </div>
  );
};

export default Page;
