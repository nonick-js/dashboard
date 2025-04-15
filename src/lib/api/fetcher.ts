import { createFetch } from '@better-fetch/fetch';
import { defaultPlugins } from '../better-fetch';

export const internalFetch = createFetch({
  baseURL: '/api',
  plugins: defaultPlugins,
});
