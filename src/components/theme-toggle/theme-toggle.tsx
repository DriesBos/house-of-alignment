'use client';

import styles from './theme-toggle.module.sass';
import { useCallback, useEffect, useState } from 'react';
import { useThemeStore } from '@/providers/theme-store-provider';
import { useTheme } from '@/hooks/useTheme';
import type { ThemeState } from '@/stores/theme-store';

export function ThemeToggle() {
  const theme = useTheme(); // Get the active theme (user preference or system)
  const setUserTheme = useThemeStore((state) => state.setUserTheme);
  const [isMounted, setIsMounted] = useState(false);

  // Only render the theme name after hydration to avoid mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleThemeChange = useCallback(() => {
    const themes: ThemeState[] = ['light', 'dark', 'stone', 'blue'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    setUserTheme(nextTheme);
  }, [setUserTheme, theme]);

  return (
    <button
      className={`${styles.themeToggle} cursorInteract`}
      onClick={handleThemeChange}
    >
      ( Theme: {isMounted ? theme : 'light'} )
    </button>
  );
}
