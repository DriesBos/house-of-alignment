'use client';

import styles from './layout-lines.module.sass';
import { useLayoutStore } from '@/providers/layout-store-provider';

export default function LayoutLines() {
  const layout = useLayoutStore((state) => state.layout);

  return (
    <div className={styles.layoutLines} data-layout={layout}>
      <div />
      <div />
      <div />
    </div>
  );
}
