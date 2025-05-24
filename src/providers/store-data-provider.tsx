'use client';

import { useThemeStore } from '@/providers/theme-store-provider';
import { useLayoutStore } from '@/providers/layout-store-provider';

export default function StoreDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useThemeStore((state) => state.theme);
  const layout = useLayoutStore((state) => state.layout);
  return (
    <main data-theme={theme} data-layout={layout}>
      {children}
    </main>
  );
}
