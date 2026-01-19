'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useLayoutStore } from '@/providers/layout-store-provider';

export default function StorePageDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const layout = useLayoutStore((state) => state.layout);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <main
      className="storePageDataWrapper"
      data-theme={isHydrated ? theme : undefined}
      data-layout={layout}
    >
      {children}
    </main>
  );
}
