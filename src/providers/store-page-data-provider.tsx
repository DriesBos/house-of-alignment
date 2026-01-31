'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';

export default function StorePageDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <main
      className="storePageDataWrapper"
      data-theme={isHydrated ? theme : undefined}
    >
      {children}
    </main>
  );
}
