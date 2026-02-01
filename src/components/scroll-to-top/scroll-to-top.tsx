'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
  const pathname = usePathname();
  const previousPathname = useRef<string | null>(null);

  useEffect(() => {
    if (
      previousPathname.current !== null &&
      previousPathname.current !== pathname
    ) {
      const scrollToTop = () => {
        const storeDataWrapper = document.querySelector('.storeDataWrapper');
        if (storeDataWrapper) {
          storeDataWrapper.scrollTo({ top: 0, behavior: 'instant' });
        }
        window.scrollTo({ top: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      };

      scrollToTop();

      // Use rAF to scroll again after the browser has painted the new route
      const rafId = requestAnimationFrame(() => {
        scrollToTop();
      });

      return () => cancelAnimationFrame(rafId);
    }

    previousPathname.current = pathname;
  }, [pathname]);

  // Always keep previousPathname in sync, even when the scroll branch runs
  useEffect(() => {
    previousPathname.current = pathname;
  }, [pathname]);

  return null;
}
