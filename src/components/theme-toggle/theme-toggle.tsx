'use client';

import styles from './theme-toggle.module.sass';
import { useCallback } from 'react';
import { useThemeStore } from '@/providers/theme-store-provider';
import type { ThemeState } from '@/stores/theme-store';

export function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  const handleThemeChange = useCallback(() => {
    const themes: ThemeState[] = ['light', 'dark', 'stone', 'blue'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    setTheme(nextTheme);
  }, [setTheme, theme]);

  return (
    <button className={styles.themeToggle} onClick={handleThemeChange}>
      ( Theme: {theme} )
    </button>
  );
}
