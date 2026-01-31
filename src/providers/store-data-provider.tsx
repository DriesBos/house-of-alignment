'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';

export default function StoreDataProvider({
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
    <div
      className="storeDataWrapper"
      data-theme={isHydrated ? theme : undefined}
    >
      {children}
    </div>
  );
}
