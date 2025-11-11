'use client';

import styles from './header.module.sass';
import { useThemeStore } from '@/providers/theme-store-provider';
import { useCallback, useState, useEffect, useRef } from 'react';
import type { ThemeState } from '@/stores/theme-store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGlobalData } from '@/providers/global-data-provider';

interface TagCount {
  name: string;
  taggings_count: number;
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [tagCounts, setTagCounts] = useState<{ [key: string]: number }>({});
  const headerRef = useRef<HTMLElement>(null);
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const pathname = usePathname();
  const { globalData } = useGlobalData();

  // Fetch tag counts for Dinners and Interviews
  useEffect(() => {
    const fetchTagCounts = async () => {
      try {
        const response = await fetch(
          `https://api.storyblok.com/v2/cdn/tags?token=${process.env.NEXT_PUBLIC_STORYBLOK_TOKEN}`
        );
        const data = await response.json();

        // Create a map of tag names to their counts
        const counts: { [key: string]: number } = {};
        data.tags.forEach((tag: TagCount) => {
          counts[tag.name] = tag.taggings_count;
        });

        setTagCounts(counts);
      } catch (error) {
        console.error('Error fetching tag counts:', error);
      }
    };

    fetchTagCounts();
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // Only add listener if menu is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    const storeDataWrapper = document.querySelector('.storeDataWrapper');

    if (isOpen && storeDataWrapper) {
      // Save current scroll position
      const scrollPosition = storeDataWrapper.scrollTop;
      // Prevent scrolling
      storeDataWrapper.classList.add('no-scroll');
      (storeDataWrapper as HTMLElement).style.overflow = 'hidden';

      return () => {
        // Restore scrolling
        storeDataWrapper.classList.remove('no-scroll');
        (storeDataWrapper as HTMLElement).style.overflow = 'auto';
        // Restore scroll position
        storeDataWrapper.scrollTop = scrollPosition;
      };
    }
  }, [isOpen]);

  const handleThemeChange = useCallback(() => {
    const themes: ThemeState[] = ['light', 'dark', 'stone', 'blue'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    setTheme(nextTheme);
  }, [setTheme, theme]);

  const toggleHeader = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <header className={styles.header} data-active={isOpen} ref={headerRef}>
      <div className={styles.header_top}>
        <div className={styles.logo}>
          <Link href="/">House of Alignment</Link>
        </div>
        <div
          className={styles.menuIcon}
          onClick={toggleHeader}
          data-active={isOpen}
        >
          <div className={styles.menuIcon_bar} />
          <div className={styles.menuIcon_bar} />
        </div>
        {/* <div className={styles.slogan}>( {globalData.slogan} )</div> */}
        <div className={styles.slogan}></div>
      </div>
      <div className={styles.header_bottom}>
        <nav className={styles.header_nav}>
          <ul>
            <li>
              <Link href="/">Archive</Link>
            </li>
            <li>
              <Link href="/tags/dinners">
                Dinners
                {tagCounts['Dinners'] ? (
                  <span>({tagCounts['Dinners']})</span>
                ) : (
                  ''
                )}
              </Link>
            </li>
            <li>
              <Link href="/tags/interviews">
                Interviews
                {tagCounts['Interviews'] ? (
                  <span>({tagCounts['Interviews']})</span>
                ) : (
                  ''
                )}
              </Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
          </ul>
        </nav>
        <div className={styles.header_buttons}>
          <button onClick={handleThemeChange}>( Theme: {theme} )</button>
        </div>
      </div>
    </header>
  );
}
