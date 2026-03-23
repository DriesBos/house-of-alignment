'use client';

import { RefObject } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

interface UseColumnParallaxOptions {
  containerRef: RefObject<HTMLDivElement | null>;
  columnRefs: RefObject<HTMLDivElement | null>[];
  dependencies: unknown[];
  normalizeScroll?: boolean;
  skipOnMobile?: boolean;
}

export function useColumnParallax({
  containerRef,
  columnRefs,
  dependencies,
  normalizeScroll = false,
  skipOnMobile = false,
}: UseColumnParallaxOptions) {
  useGSAP(
    () => {
      if (!containerRef.current) return;
      if (skipOnMobile && window.matchMedia('(max-width: 770px)').matches)
        return;

      let isDisposed = false;
      let rafId = 0;
      let normalizer: ReturnType<typeof ScrollTrigger.normalizeScroll>;

      rafId = requestAnimationFrame(() => {
        if (isDisposed) return;

        try {
          const scroller = document.querySelector(
            '.storeDataWrapper',
          ) as HTMLElement | null;
          if (!scroller) return;

          if (normalizeScroll) {
            normalizer = ScrollTrigger.normalizeScroll({
              target: scroller,
              allowNestedScroll: true,
              lockAxis: false,
              // Pointer normalization conflicts with OrbitControls drag/release on canvas.
              type: 'touch,wheel',
            });
          }

          const columnData = columnRefs
            .map((ref) => ({
              ref: ref.current,
              height: ref.current?.offsetHeight || 0,
            }))
            .filter((col) => col.ref !== null);

          if (columnData.some((col) => col.height === 0)) return;

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
        } catch (error) {
          console.error('ScrollTrigger initialization failed:', error);
        }
      });

      return () => {
        isDisposed = true;
        cancelAnimationFrame(rafId);
        normalizer?.kill();
      };
    },
    {
      scope: containerRef,
      dependencies,
      revertOnUpdate: true,
    },
  );
}
