'use client';

import {
  SbBlokData,
  storyblokEditable,
  StoryblokServerComponent,
} from '@storyblok/react/rsc';
import React, { useEffect } from 'react';
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

  // Set layout to 'three' when component mounts
  useEffect(() => {
    setLayout('one');
  }, [setLayout]);
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
