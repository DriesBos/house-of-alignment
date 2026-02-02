'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import styles from './corner-smiley.module.sass';

const ThreeDContainer = dynamic(
  () => import('../three-d-container/three-d-container'),
  {
    ssr: false,
    loading: () => <div className={styles.threeDPlaceholder} aria-hidden />,
  }
);

const CornerSmiley = () => {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isTagsLanding = pathname === '/tags';
  const isTagsRoute = pathname.startsWith('/tags/');

  if (!isHome && !isTagsLanding && !isTagsRoute) {
    return null;
  }

  return (
    <div className={`${styles.cornerSmiley} cornerSmiley cursorInteract`}>
      <ThreeDContainer />
    </div>
  );
};

export default CornerSmiley;
