import type { MetadataConfig } from '@/@types/config';

const metadataConfig: MetadataConfig = {
  name: 'NoNICK.js',
  description: 'Discordサーバーを簡単に、効率的に管理しよう。',
  url: new URL(
    process.env.NEXT_PUBLIC_VERCEL_URL ||
      `http://localhost:${process.env.PORT || '3000'}`,
  ),
  twitter: {
    site: '@nonick_js',
    creator: '@nonick_mc',
  },
};

export default metadataConfig;
