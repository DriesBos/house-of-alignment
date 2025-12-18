'use client';

import {
  type ReactNode,
  createContext,
  useRef,
  useContext,
} from 'react';
import { useStore } from 'zustand';

import { type ThemeStore, createThemeStore } from '@/stores/theme-store';
import { useTheme } from '@/hooks/useTheme';
import { useEffect } from 'react';

export type ThemeStoreApi = ReturnType<typeof createThemeStore>;

export const ThemeStoreContext = createContext<ThemeStoreApi | undefined>(
  undefined
);

export interface ThemeStoreProviderProps {
  children: ReactNode;
}

/**
 * ThemeProvider component that applies the active theme to the DOM
 * Separated from ThemeStoreProvider to properly handle hooks
 */
function ThemeApplier() {
  const theme = useTheme();

  useEffect(() => {
    // Update the html data-theme attribute when theme changes
    // Note: Initial theme is set by the blocking script in layout.tsx
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return null;
}

export const ThemeStoreProvider = ({ children }: ThemeStoreProviderProps) => {
  const storeRef = useRef<ThemeStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createThemeStore();
  }

  return (
    <ThemeStoreContext.Provider value={storeRef.current}>
      <ThemeApplier />
      {children}
    </ThemeStoreContext.Provider>
  );
};

export const useThemeStore = <T,>(selector: (store: ThemeStore) => T): T => {
  const themeStoreContext = useContext(ThemeStoreContext);

  if (!themeStoreContext) {
    throw new Error(`useThemeStore must be used within ThemeStoreProvider`);
  }

  return useStore(themeStoreContext, selector);
};
