import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import '@/styles/reset.css';
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
import Cursor from '@/components/cursor/cursor';

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
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'House of Alignment',
  },
  formatDetection: {
    telephone: false,
  },
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch global data on the server
  const globalData = await fetchGlobalData('published');
  return (
    <html lang="en" suppressHydrationWarning>
      <StoryblokProvider>
        <ThemeStoreProvider>
          <LayoutStoreProvider>
            <GlobalDataProvider initialData={globalData}>
              <body className={`${helvetica.variable} ${bradfort.variable}`}>
                {/* Blocking script to apply theme before React hydrates - prevents flash */}
                <script
                  dangerouslySetInnerHTML={{
                    __html: `
                      (function() {
                        try {
                          const THEME_KEY = 'hoa-theme-preference';
                          const stored = localStorage.getItem(THEME_KEY);
                          
                          let theme = 'stone'; // default

                          // If user has a stored preference, use it
                          if (stored && ['light', 'dark', 'stone', 'blue'].includes(stored)) {
                            theme = stored;
                          }
                          
                          document.documentElement.setAttribute('data-theme', theme);
                        } catch (e) {
                          // If anything fails, default theme from CSS will be used
                        }
                      })();
                    `,
                  }}
                />
                <Cursor />
                <CornerSmiley />
                <ScrollToTop />
                <Header />
                <StoreDataProvider>
                  <StorePageDataProvider>
                    {children}
                    <LayoutLines />
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
