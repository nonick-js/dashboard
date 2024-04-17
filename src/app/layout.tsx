import { Toaster } from '@/components/ui/toaster';
import metadataConfig from '@/config/metadata';
import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: metadataConfig.url,
  title: {
    default: metadataConfig.name,
    template: `%s - ${metadataConfig.name}`,
  },
  description: metadataConfig.description,
  openGraph: {
    title: metadataConfig.name,
    description: metadataConfig.description,
    siteName: metadataConfig.name,
    url: metadataConfig.url,
    locale: 'ja-JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: metadataConfig.name,
    description: metadataConfig.description,
    site: '@nonick_js',
    creator: '@nonick_mc',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ja'>
      <body className={notoSansJP.className}>
        <Providers>
          <main>{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
