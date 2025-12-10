'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll the custom scroll container to top on route change
    const storeDataWrapper = document.querySelector('.storeDataWrapper');
    if (storeDataWrapper) {
      storeDataWrapper.scrollTop = 0;
    }
    // Also scroll window to top as fallback
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
