import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@/styles/reset.css';
import '@/styles/vars.sass';
import '@/styles/mixins.sass';
import '@/styles/typography.sass';
import '@/styles/globals.sass';
import { ThemeStoreProvider } from '@/providers/theme-store-provider';
import { LayoutStoreProvider } from '@/providers/layout-store-provider';
import StoryblokProvider from '@/providers/storyblok-provider';
import Header from '@/components/header/header';
import Footer from '@/components/footer/footer';
import LayoutLines from '@/components/layout-lines/layout-lines';
import StoreDataProvider from '@/providers/store-data-provider';
import StorePageDataProvider from '@/providers/store-page-data-provider';
import { GlobalDataProvider } from '@/providers/global-data-provider';
import { fetchGlobalData } from '@/utils/fetchGlobalData';
import CornerSmiley from '@/components/corner-smiley/corner-smiley';
import ScrollToTop from '@/components/scroll-to-top/scroll-to-top';

const helvetica = localFont({
  src: [
    {
      path: './../fonts/HelveticaNeueLTStd-Cn.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-helvetica',
});

const bradfort = localFont({
  src: [
    {
      path: './../fonts/BradfordMonoLL-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-bradford',
});

export const metadata: Metadata = {
  title: 'House of Alignment',
  description: 'Make energy your priority',
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: '/favicon/favicon-light.ico',
        href: '/favicon/favicon-light.ico',
        type: 'image/x-icon',
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/favicon/favicon.ico',
        href: '/favicon/favicon-dark.ico',
        type: 'image/x-icon',
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch global data on the server
  const globalData = await fetchGlobalData('published');
  return (
    <html lang="en">
      <StoryblokProvider>
        <ThemeStoreProvider>
          <LayoutStoreProvider>
            <GlobalDataProvider initialData={globalData}>
              <body className={`${helvetica.variable} ${bradfort.variable}`}>
                <ScrollToTop />
                <Header />
                <StoreDataProvider>
                  <StorePageDataProvider>
                    {children}
                    <LayoutLines />
                    <CornerSmiley />
                  </StorePageDataProvider>
                  <Footer />
                </StoreDataProvider>
              </body>
            </GlobalDataProvider>
          </LayoutStoreProvider>
        </ThemeStoreProvider>
      </StoryblokProvider>
    </html>
  );
}
