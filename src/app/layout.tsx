import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/styles/reset.css';
import '@/styles/vars.sass';
import '@/styles/typography.sass';
import '@/styles/globals.sass';
import ThreeDContainer from '@/components/three-d-container/three-d-container';
import { ThemeStoreProvider } from '@/providers/theme-store-provider';
import { LayoutStoreProvider } from '@/providers/layout-store-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'House of Alignment',
  description: 'Description of the House of Alignment',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeStoreProvider>
        <LayoutStoreProvider>
          <body className={`${geistSans.variable} ${geistMono.variable}`}>
            {children}
            <ThreeDContainer />
          </body>
        </LayoutStoreProvider>
      </ThemeStoreProvider>
    </html>
  );
}
