'use client';

import { useGlobalData } from '@/providers/global-data-provider';
import { ScrambledSlogans } from '@/components/scrambled-slogans/scrambled-slogans';
import styles from './slogan-wrapper.module.sass';

interface SloganWrapperProps {
  className?: string;
}

export function SloganWrapper({ className }: SloganWrapperProps) {
  const { globalData } = useGlobalData();

  if (
    !globalData.slogans ||
    !Array.isArray(globalData.slogans) ||
    globalData.slogans.length === 0
  ) {
    return null;
  }

  return (
    <div className={styles.sloganWrapper}>
      <ScrambledSlogans slogans={globalData.slogans} />
    </div>
  );
}
