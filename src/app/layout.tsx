import './globals.css';
import { CheckSession } from '@/components/check-session';
import { ConsoleWarning } from '@/components/console-warn';
import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import { Provider } from './provider';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ja' suppressHydrationWarning>
      <body className={notoSansJP.className}>
        <Provider>
          <main>{children}</main>
          <NextTopLoader color='#006FEE' height={4} showSpinner={false} />
          <ConsoleWarning />
          <CheckSession />
        </Provider>
      </body>
    </html>
  );
}
