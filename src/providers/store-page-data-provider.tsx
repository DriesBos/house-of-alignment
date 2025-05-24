'use client';

import { useThemeStore } from '@/providers/theme-store-provider';
import { useLayoutStore } from '@/providers/layout-store-provider';

export default function StorePageDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useThemeStore((state) => state.theme);
  const layout = useLayoutStore((state) => state.layout);
  return (
    <main
      className="storePageDataWrapper"
      data-theme={theme}
      data-layout={layout}
    >
      {children}
    </main>
  );
}
