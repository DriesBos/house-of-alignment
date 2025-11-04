'use client';

import styles from './header.module.sass';
import { useThemeStore } from '@/providers/theme-store-provider';
import { useCallback, useState, useEffect } from 'react';
import type { ThemeState } from '@/stores/theme-store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGlobalData } from '@/providers/global-data-provider';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const pathname = usePathname();
  const { globalData } = useGlobalData();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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
    <header className={styles.header} data-active={isOpen}>
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
        <div className={styles.slogan}>( {globalData.slogan} )</div>
      </div>
      <div className={styles.header_bottom}>
        <nav className={styles.header_nav}>
          <ul>
            <li>
              <Link href="/">Index</Link>
            </li>
            <li>
              <Link href="/tags/dinners">Dinners</Link>
            </li>
            <li>
              <Link href="/tags/interviews">Interviews</Link>
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
