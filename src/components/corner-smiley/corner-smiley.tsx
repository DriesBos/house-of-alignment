'use client';

import { usePathname } from 'next/navigation';
import ThreeDContainer from '../three-d-container/three-d-container';
import styles from './corner-smiley.module.sass';

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
