'use client';

import styles from './theme-toggle.module.sass';
import { useEffect, useRef, useState } from 'react';
import { useThemeStore } from '@/providers/theme-store-provider';
import { useTheme } from '@/hooks/useTheme';
import { THEME_ORDER, type ThemeState } from '@/stores/theme-store';

const DEBOUNCE_MS = 300;

export function ThemeToggle() {
  const theme = useTheme();
  const setUserTheme = useThemeStore((state) => state.setUserTheme);
  const [isMounted, setIsMounted] = useState(false);
  const lastClickRef = useRef(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClick = () => {
    const now = performance.now();
    if (now - lastClickRef.current < DEBOUNCE_MS) return;
    lastClickRef.current = now;

    const idx = THEME_ORDER.indexOf(theme);
    const next: ThemeState = THEME_ORDER[(idx + 1) % THEME_ORDER.length];
    setUserTheme(next);
  };

  return (
    <button
      className={`${styles.themeToggle} cursorInteract`}
      onClick={handleClick}
    >
      ( Theme: {isMounted ? theme : 'stone'} )
    </button>
  );
}
