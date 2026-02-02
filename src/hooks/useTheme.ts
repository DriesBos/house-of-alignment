import { useThemeStore } from '@/providers/theme-store-provider';
import type { ThemeState } from '@/stores/theme-store';

/**
 * Hook that returns the currently active theme
 *
 * Logic:
 * - If user has set a theme preference, use that
 * - Otherwise, fall back to 'stone' (the default theme)
 */
export function useTheme(): ThemeState {
  const userTheme = useThemeStore((state) => state.userTheme);

  return userTheme ?? 'stone';
}

