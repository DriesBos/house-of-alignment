'use client';

import { useThemeStore } from '@/providers/theme-store-provider';
import Layout from '@/components/layout/layout';

export default function Home() {
  const theme = useThemeStore((state) => state.theme);

  return (
    <div>
      <main data-theme={theme}>
        <Layout />
      </main>
    </div>
  );
}
