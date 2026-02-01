'use client';

import { ISbStoryData } from '@storyblok/react/rsc';
import React, { useRef, useEffect, useState } from 'react';
import styles from './index-tiles.module.sass';
import { useLayoutStore } from '@/providers/layout-store-provider';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const IndexTiles: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const setLayout = useLayoutStore((state) => state.setLayout);
  const [allStories, setAllStories] = useState<ISbStoryData[]>([]);
  const tag = 'mentorship';

  // GSAP animation for mouse-based grid row adjustment
  useGSAP(
    () => {
      const container = containerRef.current;
      const grid = gridRef.current;
      if (!container || !grid) return;

      // Set initial center values to prevent jump on first mouse enter
      // Center position: normalizedX = 0.5, normalizedY = 0.5
      gsap.set(grid, {
        '--grid-rows-1': '50%', // 70 - (0.5 * 40) = 50
        '--grid-rows-2': '50%', // 30 + (0.5 * 40) = 50
        '--grid-col-2': '25vw', // 35 - (0.5 * 20) = 25
        '--grid-col-3': '25vw', // 15 + (0.5 * 20) = 25
      });

      // Create a single reusable GSAP context for better performance
      const ctx = gsap.context(() => {});

      // Cache rect to avoid constant getBoundingClientRect calls
      let rect = container.getBoundingClientRect();

      // Update rect on resize and reset grid to initial positions
      const updateRect = () => {
        rect = container.getBoundingClientRect();

        // Reset grid to centered initial positions
        gsap.set(grid, {
          '--grid-rows-1': '50%',
          '--grid-rows-2': '50%',
          '--grid-col-2': '25vw',
          '--grid-col-3': '25vw',
        });
      };
      window.addEventListener('resize', updateRect);

      // Use requestAnimationFrame for smooth updates
      let rafId: number | undefined;
      let mouseX = 0;
      let mouseY = 0;
      let isMouseMoving = false;

      // Store the last tween to kill it before creating a new one
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
        // Calculate normalized positions (0 to 1)
        const normalizedX = Math.max(0, Math.min(1, mouseX / rect.width));
        const normalizedY = Math.max(0, Math.min(1, mouseY / rect.height));

        // Map normalized Y position to row percentages
        // 0 (top) = 60% 40%, 1 (bottom) = 40% 60%
        const row1Percent = 70 - normalizedY * 40;
        const row2Percent = 30 + normalizedY * 40;

        // Check if viewport is less than 600px
        const isMobile = window.innerWidth < 600;

        // Kill the previous tween to avoid queue buildup
        if (currentTween) {
          currentTween.kill();
        }

        // On mobile (< 600px), only animate rows, disable column animations
        if (isMobile) {
          currentTween = gsap.to(grid, {
            '--grid-rows-1': `${row1Percent}%`,
            '--grid-rows-2': `${row2Percent}%`,
            duration: 0.4,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        } else {
          // On desktop, animate both rows and columns
          // Map normalized X position to column widths
          // 0 (left) = 35vw 15vw, 1 (right) = 15vw 35vw
          const col2Width = 35 - normalizedX * 20;
          const col3Width = 15 + normalizedX * 20;

          currentTween = gsap.to(grid, {
            '--grid-rows-1': `${row1Percent}%`,
            '--grid-rows-2': `${row2Percent}%`,
            '--grid-col-2': `${col2Width}vw`,
            '--grid-col-3': `${col3Width}vw`,
            duration: 0.4,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }

        isMouseMoving = false;
      };

      container.addEventListener('mousemove', handleMouseMove);

      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', updateRect);
        if (rafId) cancelAnimationFrame(rafId);
        if (currentTween) currentTween.kill();
        ctx.revert();
      };
    },
    { scope: containerRef },
  );

  // Set layout to 'tiles' when component mounts
  useEffect(() => {
    setLayout('one');
  }, [setLayout]);

  // Fetch stories filtered by tag
  useEffect(() => {
    const fetchStoriesByTag = async () => {
      try {
        if (!tag) {
          console.warn('Tag is empty or undefined');
          return;
        }

        // Convert URL-friendly slug to properly formatted tag
        // Replace '-' and '_' with spaces, then capitalize each word
        const tagName = tag
          .replace(/[-_]/g, ' ')
          .split(' ')
          .map(
            (word) =>
              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
          )
          .join(' ');

        const response = await fetch(
          `https://api.storyblok.com/v2/cdn/stories?version=published&with_tag=${tagName}&token=${process.env.NEXT_PUBLIC_STORYBLOK_TOKEN}`,
        );
        const data = await response.json();
        setAllStories(data.stories || []);
      } catch (error) {
        console.error('Error fetching stories by tag:', error);
      }
    };

    fetchStoriesByTag();
  }, [tag]);

  return (
    <div className={styles.indexTiles} ref={containerRef}>
      <div className={styles.indexTiles_Grid} ref={gridRef}>
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
