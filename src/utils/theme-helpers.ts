/**
 * Theme utility functions
 * 
 * This file contains helper functions for working with themes in the application.
 */

import type { ThemeState } from '@/stores/theme-store';

/**
 * Get the system theme preference
 * This is a synchronous function that returns the current system theme
 * Note: Only returns 'light' or 'dark' as these are the only values the system supports
 */
export function getSystemTheme(): Extract<ThemeState, 'light' | 'dark'> {
  if (typeof window === 'undefined') {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/**
 * All available themes in the application
 */
export const AVAILABLE_THEMES: ThemeState[] = ['light', 'dark', 'stone', 'blue'];

/**
 * Check if a string is a valid theme
 */
export function isValidTheme(value: string): value is ThemeState {
  return AVAILABLE_THEMES.includes(value as ThemeState);
}

/**
 * Get the next theme in the cycle
 */
export function getNextTheme(currentTheme: ThemeState): ThemeState {
  const currentIndex = AVAILABLE_THEMES.indexOf(currentTheme);
  const nextIndex = (currentIndex + 1) % AVAILABLE_THEMES.length;
  return AVAILABLE_THEMES[nextIndex];
}

/**
 * Get the previous theme in the cycle
 */
export function getPreviousTheme(currentTheme: ThemeState): ThemeState {
  const currentIndex = AVAILABLE_THEMES.indexOf(currentTheme);
  const previousIndex =
    currentIndex === 0 ? AVAILABLE_THEMES.length - 1 : currentIndex - 1;
  return AVAILABLE_THEMES[previousIndex];
}

