import type { Metadata } from 'next';
import '@/styles/reset.css';
import '@/styles/vars.sass';
import '@/styles/typography.sass';
import '@/styles/globals.sass';
import ThreeDContainer from '@/components/three-d-container/three-d-container';
import { ThemeStoreProvider } from '@/providers/theme-store-provider';
import { LayoutStoreProvider } from '@/providers/layout-store-provider';
import localFont from 'next/font/local';
import Footer from '@/components/footer/footer';

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
          <body className={`${helvetica.variable} ${bradfort.variable}`}>
            {children}
            <ThreeDContainer />
            <Footer />
          </body>
        </LayoutStoreProvider>
      </ThemeStoreProvider>
    </html>
  );
}
