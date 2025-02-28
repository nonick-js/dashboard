import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import { Provider } from './provider';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-sans',
});

export const metadata: Metadata = {
  title: {
    default: 'NoNICK.js',
    template: '%s - NoNICK.js',
  },
  description: 'Discordサーバーをもっと便利に！',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ja' suppressHydrationWarning>
      <body className={`${notoSansJP.variable} antialiased`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
