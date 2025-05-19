'use client';

import { useThemeStore } from '@/providers/theme-store-provider';
import { useLayoutStore } from '@/providers/layout-store-provider';
import { useCallback } from 'react';
import type { ThemeState } from '@/stores/theme-store';
import type { LayoutState } from '@/stores/layout-store';
import Layout from '@/components/layout/layout';

export default function Home() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const layout = useLayoutStore((state) => state.layout);
  const setLayout = useLayoutStore((state) => state.setLayout);

  const handleThemeChange = useCallback(() => {
    const themes: ThemeState[] = ['light', 'dark', 'stone', 'blue'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    setTheme(nextTheme);
  }, [setTheme, theme]);

  const handleLayoutChange = useCallback(() => {
    const layouts: LayoutState[] = ['one', 'two', 'three'];
    const currentIndex = layouts.indexOf(layout);
    const nextIndex = (currentIndex + 1) % layouts.length;
    const nextLayout = layouts[nextIndex];
    setLayout(nextLayout);
  }, [setLayout, layout]);

  return (
    <div>
      <main data-theme={theme}>
        <Layout />
        <div className="testButtons">
          <button onClick={handleThemeChange}>Theme: {theme}</button>
          <button onClick={handleLayoutChange}>Layout: {layout}</button>
        </div>
      </main>
    </div>
  );
}
