import metadataConfig from '@/config/metadata';
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: metadataConfig.name,
    short_name: metadataConfig.name,
    description: metadataConfig.description,
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#09090b',
    icons: [
      {
        src: '/pwa/default_icon.svg',
        type: 'image/svg+xml',
        sizes: 'any',
        purpose: 'any',
      },
      {
        src: '/pwa/maskable_icon.svg',
        type: 'image/svg+xml',
        sizes: 'any',
        purpose: 'maskable',
      },
      // {
      //   src: '/pwa/monochrome_icon.svg',
      //   type: 'image/svg+xml',
      //   sizes: 'any',
      //   purpose: 'maskable',
      // },
    ],
  };
}
