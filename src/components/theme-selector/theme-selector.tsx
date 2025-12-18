'use client';

/**
 * ThemeSelector - Optional component for explicit theme selection
 * 
 * This component provides individual buttons for each theme,
 * including an option to use the system theme.
 * 
 * Usage:
 * import { ThemeSelector } from '@/components/theme-selector/theme-selector';
 * 
 * <ThemeSelector />
 */

import { useThemeStore } from '@/providers/theme-store-provider';
import { useTheme } from '@/hooks/useTheme';
import { useSystemTheme } from '@/hooks/useSystemTheme';
import type { ThemeState } from '@/stores/theme-store';

export function ThemeSelector() {
  const currentTheme = useTheme();
  const userTheme = useThemeStore((state) => state.userTheme);
  const setUserTheme = useThemeStore((state) => state.setUserTheme);
  const systemTheme = useSystemTheme();

  const themes: { value: ThemeState | null; label: string }[] = [
    { value: null, label: `System (${systemTheme})` },
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'stone', label: 'Stone' },
    { value: 'blue', label: 'Blue' },
  ];

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {themes.map((theme) => (
        <button
          key={theme.value ?? 'system'}
          onClick={() => setUserTheme(theme.value)}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid currentColor',
            background:
              userTheme === theme.value ? 'currentColor' : 'transparent',
            color: userTheme === theme.value ? 'var(--color-bg)' : 'inherit',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
          aria-pressed={userTheme === theme.value}
          aria-label={`Use ${theme.label} theme`}
        >
          {theme.label}
          {userTheme === theme.value && ' ✓'}
        </button>
      ))}
      <div
        style={{
          padding: '0.5rem',
          fontSize: '0.875rem',
          opacity: 0.7,
        }}
      >
        Active: {currentTheme}
      </div>
    </div>
  );
}

