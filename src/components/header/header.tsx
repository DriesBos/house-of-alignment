'use client';

import styles from './header.module.sass';
import { useCallback, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { gsap, useGSAP } from '@/lib/gsap';
import { ThemeToggle } from '@/components/theme-toggle/theme-toggle';
import { SloganWrapper } from '@/components/slogan-wrapper/slogan-wrapper';

interface HeaderProps {
  tagCounts?: Record<string, number>;
}

export default function Header({ tagCounts = {} }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
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
      remToPixels + 38 + 83 * 5 + remToPixels + 6 * remToPixels;
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

  // Close menu when route changes
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  useEffect(() => {
    // Only close if currently open - avoids unnecessary state changes
    if (isOpenRef.current) {
      setIsOpen(false);
    }
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
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // Use setTimeout to add the listener on the next tick,
    // preventing the same click that opened the menu from immediately closing it
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
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

  const openHeader = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeHeader = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleMenuIconClick = useCallback(
    (e: React.MouseEvent) => {
      // Only respond to genuine user clicks, not synthetic events from GSAP
      if (!e.isTrusted) return;

      if (isOpen) {
        closeHeader();
      } else {
        openHeader();
      }
    },
    [isOpen, openHeader, closeHeader]
  );

  // Animate header height and fade elements when menu opens/closes
  useGSAP(
    () => {
      if (!headerRef.current) return;

      const elements = headerRef.current.querySelectorAll('.headerFadeIn');
      const navElements =
        headerRef.current.querySelectorAll('.headerNavFadeIn');

      // Always kill any ongoing animations first to prevent conflicts
      gsap.killTweensOf(headerRef.current);
      if (elements.length > 0) {
        gsap.killTweensOf(elements);
      }
      if (navElements.length > 0) {
        gsap.killTweensOf(navElements);
      }

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
        // Hide elements immediately
        if (elements.length > 0) {
          gsap.set(elements, { opacity: 0 });
        }
        if (navElements.length > 0) {
          gsap.set(navElements, { opacity: 0 });
        }

        // Animate header height closed
        gsap.to(headerRef.current, {
          height: getClosedHeight(),
          minHeight: getClosedHeight(),
          duration: 0.25,
          ease: 'power1.out',
        });
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
          <Link className="cursorInteract" href="/">
            House of Alignment
          </Link>
        </div>
        <div
          className={`${styles.menuIcon} cursorInteract`}
          onClick={handleMenuIconClick}
          data-active={isOpen}
        >
          <div className={styles.menuIcon_bar} />
          <div className={styles.menuIcon_bar} />
        </div>
        <SloganWrapper />
      </div>
      <div
        className={styles.header_bottom}
        ref={headerBottomRef}
        data-active={isOpen}
      >
        <nav className={styles.header_nav}>
          <ul>
            <li className="headerNavFadeIn cursorInteract">
              <Link href="/">All Events</Link>
            </li>
            <li className="headerNavFadeIn cursorInteract">
              <Link href="/tags/dinner">
                Dinners
                {tagCounts['Dinners'] || tagCounts['Dinner'] ? (
                  <span>({tagCounts['Dinners'] || tagCounts['Dinner']})</span>
                ) : (
                  ''
                )}
              </Link>
            </li>
            <li className="headerNavFadeIn cursorInteract">
              <Link href="/mentorship">
                Mentorship
                {tagCounts['Mentorship'] || tagCounts['Mentorships'] ? (
                  <span>
                    ({tagCounts['Mentorship'] || tagCounts['Mentorships']})
                  </span>
                ) : (
                  ''
                )}
              </Link>
            </li>
            <li className="headerNavFadeIn cursorInteract">
              <Link href="/tags/interview">
                Conversations
                {tagCounts['Interviews'] || tagCounts['Interview'] ? (
                  <span>
                    ({tagCounts['Interviews'] || tagCounts['Interview']})
                  </span>
                ) : (
                  ''
                )}
              </Link>
            </li>
            <li className="headerNavFadeIn cursorInteract">
              <Link href="/about">About</Link>
            </li>
          </ul>
        </nav>
        <div className={`${styles.buttons} headerNavFadeIn cursorInteract`}>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
