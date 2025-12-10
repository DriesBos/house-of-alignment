'use client';

import styles from './header.module.sass';
import { useThemeStore } from '@/providers/theme-store-provider';
import {
  useCallback,
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
} from 'react';
import type { ThemeState } from '@/stores/theme-store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
// import { useGlobalData } from '@/providers/global-data-provider';

// Register GSAP plugins
gsap.registerPlugin(useGSAP);

interface TagCount {
  name: string;
  taggings_count: number;
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [tagCounts, setTagCounts] = useState<{ [key: string]: number }>({});
  const [openHeight, setOpenHeight] = useState<number>(0);
  const headerRef = useRef<HTMLElement>(null);
  const headerBottomRef = useRef<HTMLDivElement>(null);
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const pathname = usePathname();
  // const { globalData } = useGlobalData();

  // Calculate the open height dynamically on mount
  useLayoutEffect(() => {
    const calculateOpenHeight = () => {
      if (headerBottomRef.current && headerRef.current) {
        const headerTopHeight =
          headerRef.current
            .querySelector(`.${styles.header_top}`)
            ?.getBoundingClientRect().height || 0;
        const headerBottomHeight = headerBottomRef.current.scrollHeight;
        const totalHeight = headerTopHeight + headerBottomHeight;
        setOpenHeight(totalHeight);
      }
    };

    // Calculate after fonts and content are loaded
    calculateOpenHeight();

    // Recalculate on window resize
    window.addEventListener('resize', calculateOpenHeight);
    return () => window.removeEventListener('resize', calculateOpenHeight);
  }, [tagCounts]);

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

  // Animate header height and fade elements when menu opens/closes
  useGSAP(
    () => {
      if (!headerRef.current || openHeight === 0) return;

      const elements = headerRef.current.querySelectorAll('.headerFadeIn');
      const navElements =
        headerRef.current.querySelectorAll('.headerNavFadeIn');
      const closedHeight = getComputedStyle(document.documentElement)
        .getPropertyValue('--spacing-header-height')
        .trim();

      if (isOpen) {
        // Animate header height open
        gsap.to(headerRef.current, {
          height: openHeight,
          minHeight: openHeight,
          duration: 0.25,
          ease: 'power1.out',
        });

        // Fade in overlay elements with stagger
        if (elements.length > 0) {
          gsap.fromTo(
            elements,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 2,
              stagger: 0.1,
              delay: 0.165,
              ease: 'power2.out',
            }
          );
        }

        // Fade in nav elements with stagger
        if (navElements.length > 0) {
          gsap.fromTo(
            navElements,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 1.5,
              stagger: 0.033,
              delay: 0.165,
              ease: 'power2.out',
            }
          );
        }
      } else {
        // Animate header height closed
        gsap.to(headerRef.current, {
          height: closedHeight,
          minHeight: closedHeight,
          duration: 0.25,
          ease: 'power1.out',
        });

        // Kill fade animations and hide elements
        if (elements.length > 0) {
          gsap.killTweensOf(elements);
          gsap.set(elements, { opacity: 0 });
        }

        // Kill nav fade animations and hide elements
        if (navElements.length > 0) {
          gsap.killTweensOf(navElements);
          gsap.set(navElements, { opacity: 0 });
        }
      }
    },
    {
      scope: headerRef,
      dependencies: [isOpen, openHeight],
    }
  );

  return (
    <header className={styles.header} data-active={isOpen} ref={headerRef}>
      <div className={styles.overlay}>
        <div className={`${styles.overlay_topright} headerFadeIn`}>
          ( TRUST YOUR VISION )
        </div>
        {/* <div className={`${styles.overlay_bottomleft} headerFadeIn`}>
          Home of visionary founders
        </div>
        <div className={`${styles.overlay_bottomright} headerFadeIn`}>
          Begin your next bold move
        </div> */}
      </div>
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
      <div className={styles.header_bottom} ref={headerBottomRef}>
        <nav className={styles.header_nav}>
          <ul>
            <li className="headerNavFadeIn">
              <Link href="/">Archive</Link>
            </li>
            <li className="headerNavFadeIn">
              <Link href="/tags/dinners">
                Dinners
                {tagCounts['Dinners'] ? (
                  <span>({tagCounts['Dinners']})</span>
                ) : (
                  ''
                )}
              </Link>
            </li>
            <li className="headerNavFadeIn">
              <Link href="/tags/interviews">
                Interviews
                {tagCounts['Interviews'] ? (
                  <span>({tagCounts['Interviews']})</span>
                ) : (
                  ''
                )}
              </Link>
            </li>
            <li className="headerNavFadeIn">
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
