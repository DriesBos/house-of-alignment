import { useSyncExternalStore } from 'react';
import type { ThemeState } from '@/stores/theme-store';

// Subscribe to system theme changes
function subscribe(callback: () => void): () => void {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
}

// Get current system theme (client-side)
// Note: System theme can only be 'light' or 'dark'
function getSnapshot(): Extract<ThemeState, 'light' | 'dark'> {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

// Server-side snapshot (default to light)
function getServerSnapshot(): Extract<ThemeState, 'light' | 'dark'> {
  return 'light';
}

/**
 * Hook to get the system theme preference using useSyncExternalStore
 * This properly handles hydration and avoids mismatches between server and client
 * 
 * Note: System theme can only detect 'light' or 'dark'.
 * Custom themes like 'stone' and 'blue' must be explicitly set by the user.
 */
export function useSystemTheme(): Extract<ThemeState, 'light' | 'dark'> {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

