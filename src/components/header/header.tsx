'use client';

import styles from './header.module.sass';
import { useThemeStore } from '@/providers/theme-store-provider';
import { useLayoutStore } from '@/providers/layout-store-provider';
import { useCallback, useState } from 'react';
import type { ThemeState } from '@/stores/theme-store';
import type { LayoutState } from '@/stores/layout-store';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const layout = useLayoutStore((state) => state.layout);
  const setLayout = useLayoutStore((state) => state.setLayout);

  const handleThemeChange = useCallback(() => {
    const themes: ThemeState[] = ['light', 'dark', 'stone', 'blue'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    setTheme(nextTheme);
  }, [setTheme, theme]);

  const handleLayoutChange = useCallback(() => {
    const layouts: LayoutState[] = ['one', 'two', 'three'];
    const currentIndex = layouts.indexOf(layout);
    const nextIndex = (currentIndex + 1) % layouts.length;
    const nextLayout = layouts[nextIndex];
    setLayout(nextLayout);
  }, [setLayout, layout]);

  const toggleHeader = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <>
      {/* <div
        className={styles.background}
        onClick={toggleHeader}
        data-active={isOpen}
      /> */}
      <header className={styles.header} data-active={isOpen}>
        <div className={styles.header_top}>
          <div className={styles.logo}>House of Alignment</div>
          <div
            className={styles.menuIcon}
            onClick={toggleHeader}
            data-active={isOpen}
          >
            <div className={styles.menuIcon_bar} />
            <div className={styles.menuIcon_bar} />
          </div>
          <div className={styles.slogan}>( Make energy your priority )</div>
        </div>
        <div className={styles.header_bottom}>
          <nav className={styles.header_nav}>
            <ul>
              <li>
                <a href="#home">Directory</a>
              </li>
              <li>
                <a href="#about">About</a>
              </li>
              <li>
                <a href="#services">One-on-One</a>
              </li>
            </ul>
          </nav>
          <div className={styles.header_buttons}>
            <button onClick={handleThemeChange}>( Theme: {theme} )</button>
            <button onClick={handleLayoutChange}>( Layout: {layout} )</button>
          </div>
        </div>
      </header>
    </>
  );
}
