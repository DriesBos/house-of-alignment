'use client';

import { useTheme } from '@/hooks/useTheme';
import { useLayoutStore } from '@/providers/layout-store-provider';

export default function StorePageDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
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
