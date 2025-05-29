'use client';

import {
  type ReactNode,
  createContext,
  useRef,
  useContext,
  useEffect,
} from 'react';
import { useStore } from 'zustand';

import { type ThemeStore, createThemeStore } from '@/stores/theme-store';

export type ThemeStoreApi = ReturnType<typeof createThemeStore>;

export const ThemeStoreContext = createContext<ThemeStoreApi | undefined>(
  undefined
);

export interface ThemeStoreProviderProps {
  children: ReactNode;
}

export const ThemeStoreProvider = ({ children }: ThemeStoreProviderProps) => {
  const storeRef = useRef<ThemeStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createThemeStore();
  }

  // Update DOM theme attribute when theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = window.document.documentElement;
    const unsubscribe = storeRef.current?.subscribe((state) => {
      root.setAttribute('data-theme', state.theme);
    });

    // Set initial theme
    const initialTheme = storeRef.current?.getState().theme;
    if (initialTheme) {
      root.setAttribute('data-theme', initialTheme);
    }

    return () => {
      unsubscribe?.();
    };
  }, []);

  return (
    <ThemeStoreContext.Provider value={storeRef.current}>
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
