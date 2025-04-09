import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './drizzle';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  socialProviders: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      scope: ['guilds'],
      mapProfileToUser: (profile) => {
        return {
          username: profile.username,
          discriminator: profile.discriminator,
        };
      },
    },
  },
  user: {
    additionalFields: {
      username: {
        type: 'string',
        required: true,
        input: false,
      },
      discriminator: {
        type: 'string',
        required: true,
        input: false,
      },
    },
  },
});
