import 'server-only';

import { type CreateFetchOption, createFetch } from '@better-fetch/fetch';
import { auth } from '../auth';
import { defaultPlugins, defaultRetryOption } from '../better-fetch';

const defaultFetchOptions: CreateFetchOption = {
  baseURL: 'https://discord.com/api/v10',
  retry: defaultRetryOption,
  plugins: defaultPlugins,
} as const;

export const discordFetch = createFetch(defaultFetchOptions);

export const discordOAuth2UserFetch = createFetch({
  auth: {
    type: 'Bearer',
    token: async () => {
      const session = await auth();
      if (!session) throw new Error('Not authenticated');
      return session.user.accessToken;
    },
  },
  ...defaultFetchOptions,
});
