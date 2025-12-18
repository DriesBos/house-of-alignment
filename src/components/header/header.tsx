'use client';

import styles from './header.module.sass';
import { useCallback, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ThemeToggle } from '@/components/theme-toggle/theme-toggle';
import { SloganWrapper } from '@/components/slogan-wrapper/slogan-wrapper';

// Register GSAP plugins
gsap.registerPlugin(useGSAP);

interface TagCount {
  name: string;
  taggings_count: number;
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [tagCounts, setTagCounts] = useState<{ [key: string]: number }>({});
  const headerRef = useRef<HTMLElement>(null);
  const headerBottomRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Helper function to calculate open height with manual calculation
  const getOpenHeight = () => {
    // Manual calculation based on: --header-size-expanded
    // 1rem + 38px + (83px * 4) + 1rem + 6rem = 1rem + 38px + 332px + 1rem + 6rem
    const remToPixels = parseFloat(
      getComputedStyle(document.documentElement).fontSize
    );
    const pixelValue =
      remToPixels + 38 + 83 * 4 + remToPixels + 6 * remToPixels;
    return `${pixelValue}px`;
  };

  // Helper function to calculate closed height with manual calculation
  const getClosedHeight = () => {
    // Manual calculation based on: --header-size
    // 1rem + 38px + 2px
    const remToPixels = parseFloat(
      getComputedStyle(document.documentElement).fontSize
    );
    const pixelValue = remToPixels + 38 + 2;
    return `${pixelValue}px`;
  };

  // Fetch tag counts for Dinner and Interview
  useEffect(() => {
    const fetchTagCounts = async () => {
      try {
        const token = process.env.NEXT_PUBLIC_STORYBLOK_TOKEN;
        if (!token) {
          console.error('Storyblok token not found');
          return;
        }

        const response = await fetch(
          `https://api.storyblok.com/v2/cdn/tags?token=${token}`
        );
        const data = await response.json();

        // Create a map of tag names to their counts
        const counts: { [key: string]: number } = {};
        data.tags?.forEach((tag: TagCount) => {
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

  // Close menu when pressing Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

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

  const toggleHeader = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Animate header height and fade elements when menu opens/closes
  useGSAP(
    () => {
      if (!headerRef.current) return;

      const elements = headerRef.current.querySelectorAll('.headerFadeIn');
      const navElements =
        headerRef.current.querySelectorAll('.headerNavFadeIn');

      if (isOpen) {
        // Animate header height open
        gsap.to(headerRef.current, {
          height: getOpenHeight(),
          minHeight: getOpenHeight(),
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
        // Kill any ongoing fade animations before closing
        if (elements.length > 0) {
          gsap.killTweensOf(elements);
        }
        if (navElements.length > 0) {
          gsap.killTweensOf(navElements);
        }

        // Animate header height closed
        gsap.to(headerRef.current, {
          height: getClosedHeight(),
          minHeight: getClosedHeight(),
          duration: 0.25,
          ease: 'power1.out',
        });

        // Hide elements immediately
        if (elements.length > 0) {
          gsap.set(elements, { opacity: 0 });
        }

        // Hide nav elements immediately
        if (navElements.length > 0) {
          gsap.set(navElements, { opacity: 0 });
        }
      }
    },
    {
      scope: headerRef,
      dependencies: [isOpen],
    }
  );

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
        <SloganWrapper />
      </div>
      <div className={styles.header_bottom} ref={headerBottomRef}>
        <nav className={styles.header_nav}>
          <ul>
            <li className="headerNavFadeIn">
              <Link href="/">Archive</Link>
            </li>
            <li className="headerNavFadeIn">
              <Link href="/tags/dinner">
                Dinners
                {tagCounts['Dinners'] || tagCounts['Dinner'] ? (
                  <span>({tagCounts['Dinners'] || tagCounts['Dinner']})</span>
                ) : (
                  ''
                )}
              </Link>
            </li>
            <li className="headerNavFadeIn">
              <Link href="/tags/interview">
                Interviews
                {tagCounts['Interviews'] || tagCounts['Interview'] ? (
                  <span>
                    ({tagCounts['Interviews'] || tagCounts['Interview']})
                  </span>
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
        <div className={`${styles.buttons} headerNavFadeIn`}>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
