import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import { ConsoleWarning } from '@/components/console-warn';
import metadataConfig from '@/config/metadata';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'react-hot-toast';
import { Provider } from './provider';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: metadataConfig.name,
    template: `%s - ${metadataConfig.name}`,
  },
  description: metadataConfig.description,
  openGraph: {
    title: metadataConfig.name,
    description: metadataConfig.description,
    locale: 'ja-JP',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ja' suppressHydrationWarning>
      <body className={`${notoSansJP.className} antialiased`}>
        <Provider>
          <main>{children}</main>
          <ConsoleWarning />
          <Toaster position='top-right' />
          <NextTopLoader color='#006FEE' height={4} showSpinner={false} />
        </Provider>
      </body>
    </html>
  );
}
