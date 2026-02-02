'use client';

import { RefObject, useEffect, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

interface UseColumnParallaxOptions {
  containerRef: RefObject<HTMLDivElement | null>;
  columnRefs: RefObject<HTMLDivElement | null>[];
  dependencies: unknown[];
  normalizeScroll?: boolean;
  scrollLock?: boolean;
  skipOnMobile?: boolean;
}

export function useColumnParallax({
  containerRef,
  columnRefs,
  dependencies,
  normalizeScroll = false,
  scrollLock = false,
  skipOnMobile = false,
}: UseColumnParallaxOptions) {
  const [isScrollReady, setIsScrollReady] = useState(!scrollLock);

  useEffect(() => {
    if (!scrollLock) return;

    const storeDataWrapper = document.querySelector(
      '.storeDataWrapper',
    ) as HTMLElement;
    if (!storeDataWrapper) return;

    if (!isScrollReady) {
      storeDataWrapper.style.overflow = 'hidden';

      const safetyTimeout = setTimeout(() => {
        setIsScrollReady(true);
      }, 2000);

      return () => {
        clearTimeout(safetyTimeout);
        storeDataWrapper.style.overflow = 'auto';
      };
    } else {
      storeDataWrapper.style.overflow = 'auto';
    }

    return () => {
      storeDataWrapper.style.overflow = 'auto';
    };
  }, [isScrollReady, scrollLock]);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      if (skipOnMobile && window.matchMedia('(max-width: 770px)').matches)
        return;

      requestAnimationFrame(() => {
        try {
          const scroller = document.querySelector(
            '.storeDataWrapper',
          ) as HTMLElement | null;
          if (!scroller) {
            if (scrollLock) setIsScrollReady(true);
            return;
          }

          if (normalizeScroll) {
            ScrollTrigger.normalizeScroll({
              target: scroller,
              allowNestedScroll: true,
              lockAxis: false,
              type: 'touch,wheel,pointer',
            });
          }

          const columnData = columnRefs
            .map((ref) => ({
              ref: ref.current,
              height: ref.current?.offsetHeight || 0,
            }))
            .filter((col) => col.ref !== null);

          if (columnData.some((col) => col.height === 0)) {
            if (scrollLock) setIsScrollReady(true);
            return;
          }

          const maxHeight = Math.max(...columnData.map((col) => col.height));
          const longestColumnIndex = columnData.findIndex(
            (col) => col.height === maxHeight,
          );

          columnData.forEach((col, index) => {
            if (!col.ref || index === longestColumnIndex) return;

            const pixelsToMove = maxHeight - col.height;
            if (pixelsToMove === 0) return;

            gsap.to(col.ref, {
              y: pixelsToMove,
              ease: 'none',
              force3D: true,
              willChange: 'transform',
              scrollTrigger: {
                trigger: containerRef.current,
                scroller: '.storeDataWrapper',
                start: 'top top',
                end: 'bottom bottom',
                scrub: true,
                invalidateOnRefresh: true,
              },
            });
          });

          if (scrollLock) setIsScrollReady(true);
        } catch (error) {
          console.error('ScrollTrigger initialization failed:', error);
          if (scrollLock) setIsScrollReady(true);
        }
      });
    },
    {
      scope: containerRef,
      dependencies,
      revertOnUpdate: true,
    },
  );
}
