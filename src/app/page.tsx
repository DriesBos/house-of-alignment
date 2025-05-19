'use client';

import { useThemeStore } from '@/providers/theme-store-provider';
import Footer from '@/components/footer/footer';
import Header from '@/components/header/header';
import Layout from '@/components/layout/layout';

export default function Home() {
  const theme = useThemeStore((state) => state.theme);

  return (
    <div className="page" data-theme={theme}>
      <Header />
      <main>
        <Layout />
      </main>
      <Footer />
    </div>
  );
}
