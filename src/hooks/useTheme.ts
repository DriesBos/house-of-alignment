import { useThemeStore } from '@/providers/theme-store-provider';
import { useSystemTheme } from './useSystemTheme';
import type { ThemeState } from '@/stores/theme-store';

/**
 * Hook that returns the currently active theme
 * 
 * Logic:
 * - If user has set a theme preference, use that
 * - Otherwise, fall back to system theme (light or dark)
 * 
 * This hook properly handles hydration and provides a consistent theme value
 */
export function useTheme(): ThemeState {
  const userTheme = useThemeStore((state) => state.userTheme);
  const systemTheme = useSystemTheme();

  // If user has explicitly set a theme, use it
  // Otherwise fall back to system theme
  return userTheme ?? systemTheme;
}

