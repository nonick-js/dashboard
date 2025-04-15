import { createFetch } from '@better-fetch/fetch';
import { defaultPlugins } from '../better-fetch';

export const postInternalAPI = createFetch({
  baseURL: '/api',
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  plugins: defaultPlugins,
});
