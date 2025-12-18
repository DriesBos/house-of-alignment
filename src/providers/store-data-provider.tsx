'use client';

import { useTheme } from '@/hooks/useTheme';
import { useLayoutStore } from '@/providers/layout-store-provider';

export default function StoreDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const layout = useLayoutStore((state) => state.layout);
  return (
    <div className="storeDataWrapper" data-theme={theme} data-layout={layout}>
      {children}
    </div>
  );
}
