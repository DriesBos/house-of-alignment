'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
  const pathname = usePathname();
  const previousPathname = useRef<string | null>(null);

  useEffect(() => {
    // Only scroll if the pathname actually changed (not on initial mount with same path)
    if (
      previousPathname.current !== null &&
      previousPathname.current !== pathname
    ) {
      // Immediate scroll
      const scrollToTop = () => {
        const storeDataWrapper = document.querySelector('.storeDataWrapper');
        if (storeDataWrapper) {
          storeDataWrapper.scrollTo({ top: 0, behavior: 'instant' });
        }
        window.scrollTo({ top: 0, behavior: 'instant' });
      };

      // Scroll immediately
      scrollToTop();

      // Also scroll after a short delay to handle any async content loading
      const timeoutId = setTimeout(scrollToTop, 50);

      return () => clearTimeout(timeoutId);
    }

    previousPathname.current = pathname;
  }, [pathname]);

  return null;
}
