import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@/styles/reset.css';
import '@/styles/vars.sass';
import '@/styles/typography.sass';
import '@/styles/globals.sass';
import { ThemeStoreProvider } from '@/providers/theme-store-provider';
import { LayoutStoreProvider } from '@/providers/layout-store-provider';
import StoryblokProvider from '@/providers/storyblok-provider';
import ThreeDContainer from '@/components/three-d-container/three-d-container';
import Header from '@/components/header/header';
import Footer from '@/components/footer/footer';
import LayoutLines from '@/components/layout-lines/layout-lines';
import StoreDataProvider from '@/providers/store-data-provider';
import StorePageDataProvider from '@/providers/store-page-data-provider';

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
  variable: '--font-bradfort',
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
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/favicon/favicon.ico',
        href: '/favicon/favicon-dark.ico',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <StoryblokProvider>
        <ThemeStoreProvider>
          <LayoutStoreProvider>
            <body className={`${helvetica.variable} ${bradfort.variable}`}>
              <ThreeDContainer />
              <Header />
              <StoreDataProvider>
                <StorePageDataProvider>
                  {children}
                  <LayoutLines />
                </StorePageDataProvider>
                <Footer />
              </StoreDataProvider>
            </body>
          </LayoutStoreProvider>
        </ThemeStoreProvider>
      </StoryblokProvider>
    </html>
  );
}
