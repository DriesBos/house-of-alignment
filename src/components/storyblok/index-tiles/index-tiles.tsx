'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import styles from './index-tiles.module.sass';
import { useLayoutStore } from '@/providers/layout-store-provider';
import { useStories } from '@/providers/stories-provider';
import Link from 'next/link';
import { gsap, useGSAP } from '@/lib/gsap';

const IndexTiles: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const setLayout = useLayoutStore((state) => state.setLayout);
  const { stories } = useStories();
  const allStories = useMemo(
    () =>
      [...stories]
        .filter((story) =>
          story.tag_list?.some((t: string) => t.toLowerCase() === 'programmes'),
        )
        .reverse()
        .slice(0, 6),
    [stories],
  );
  const tileCount = allStories.length;
  const hasThreeRows = tileCount >= 5;
  const hasTwoRows = tileCount >= 3 && tileCount <= 4;
  const [hasFinePointer, setHasFinePointer] = useState(true);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const getRowHeights = (normalizedY: number) => {
    if (hasThreeRows) {
      const row1 = 50 + (1 - normalizedY) * 5;
      const row2 = 50 + (1 - Math.abs(normalizedY - 0.5) * 2) * 10;
      const row3 = 50 + normalizedY * 5;

      return { row1, row2, row3 };
    }

    if (hasTwoRows) {
      const row1 = 50 + (1 - normalizedY) * 8;
      const row2 = 50 + normalizedY * 8;
      return { row1, row2, row3: 50 };
    }

    return { row1: 100, row2: 50, row3: 50 };
  };

  const getGridVars = (normalizedY: number, col2: number, col3: number) => {
    const { row1, row2, row3 } = getRowHeights(normalizedY);
    return {
      '--grid-rows-1': `${row1}vh`,
      '--grid-rows-2': `${row2}vh`,
      '--grid-rows-3': `${row3}vh`,
      '--grid-col-2': `${col2}vw`,
      '--grid-col-3': `${col3}vw`,
    };
  };

  // Detect pointer type (mouse vs touch)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setHasFinePointer(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setHasFinePointer(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Time-based animation for touch devices
  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid || hasFinePointer) return;

      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      const tl = gsap.timeline({
        repeat: -1,
        defaults: { duration: 4, ease: 'sine.inOut' },
      });

      tl.set(grid, getGridVars(0.5, 25, 25));
      tl.to(grid, getGridVars(0, 30, 20));
      tl.to(grid, getGridVars(1, 20, 30));
      tl.to(grid, getGridVars(0, 20, 30));
      tl.to(grid, getGridVars(1, 30, 20));
      tl.to(grid, getGridVars(0.5, 25, 25));

      timelineRef.current = tl;

      return () => {
        if (timelineRef.current) {
          timelineRef.current.kill();
          timelineRef.current = null;
        }
      };
    },
    {
      scope: containerRef,
      dependencies: [hasFinePointer, tileCount],
    },
  );

  // Mouse-based grid animation for pointer devices
  useGSAP(
    () => {
      const container = containerRef.current;
      const grid = gridRef.current;
      if (!container || !grid || !hasFinePointer) return;

      gsap.set(grid, getGridVars(0.5, 25, 25));

      let rect = container.getBoundingClientRect();

      const updateRect = () => {
        rect = container.getBoundingClientRect();
        gsap.set(grid, getGridVars(0.5, 25, 25));
      };
      window.addEventListener('resize', updateRect);

      let rafId: number | undefined;
      let mouseX = 0;
      let mouseY = 0;
      let isMouseMoving = false;
      let currentTween: gsap.core.Tween | null = null;

      const handleMouseMove = (e: MouseEvent) => {
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;

        if (!isMouseMoving) {
          isMouseMoving = true;
          rafId = requestAnimationFrame(updateAnimation);
        }
      };

      const updateAnimation = () => {
        const normalizedX = Math.max(0, Math.min(1, mouseX / rect.width));
        const normalizedY = Math.max(0, Math.min(1, mouseY / rect.height));

        const col2Width = 35 - normalizedX * 20;
        const col3Width = 15 + normalizedX * 20;
        const { row1, row2, row3 } = getRowHeights(normalizedY);

        if (currentTween) {
          currentTween.kill();
        }

        currentTween = gsap.to(grid, {
          '--grid-rows-1': `${row1}vh`,
          '--grid-rows-2': `${row2}vh`,
          '--grid-rows-3': `${row3}vh`,
          '--grid-col-2': `${col2Width}vw`,
          '--grid-col-3': `${col3Width}vw`,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto',
        });

        isMouseMoving = false;
      };

      container.addEventListener('mousemove', handleMouseMove);

      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', updateRect);
        if (rafId) cancelAnimationFrame(rafId);
        if (currentTween) currentTween.kill();
      };
    },
    {
      scope: containerRef,
      dependencies: [hasFinePointer, tileCount],
    },
  );

  useEffect(() => {
    setLayout('one');
  }, [setLayout]);

  return (
    <div className={styles.indexTiles} ref={containerRef}>
      <div
        className={styles.indexTiles_Grid}
        ref={gridRef}
        data-count={tileCount}
      >
        {allStories.map((item) => (
          <Link
            href={item.full_slug}
            key={item.uuid}
            className={styles.indexTiles_Tile}
          >
            <h1 className="cursorInteract">{item.content.page_title}</h1>
            <p className="cursorInteract">{item.content.page_descr}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default IndexTiles;
