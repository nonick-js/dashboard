import 'server-only';

import type { RESTPostOAuth2AccessTokenResult } from 'discord-api-types/v10';
import NextAuth from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import discord from 'next-auth/providers/discord';
import { discordFetch } from './discord/fetch';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    discord({
      authorization: 'https://discord.com/api/oauth2/authorize?scope=identify+guilds',
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    jwt: async ({ token, account }) => {
      if (account) {
        return {
          ...token,
          userId: account.providerAccountId,
          accessToken: account.access_token as string,
          refreshToken: account.refresh_token as string,
          expiresAt: account.expires_at as number,
        } as JWT;
      }

      if (Date.now() < token.expiresAt * 1000) return token;

      const { data, error } = await discordFetch<RESTPostOAuth2AccessTokenResult>('/oauth2/token', {
        method: 'POST',
        body: new URLSearchParams({
          client_id: process.env.AUTH_DISCORD_ID,
          client_secret: process.env.AUTH_DISCORD_SECRET,
          grant_type: 'refresh_token',
          refresh_token: token.refreshToken,
        }),
        next: { revalidate: 60 },
      });

      if (error) {
        token.error = 'RefreshTokenError';
        return token;
      }

      return {
        ...token,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: Math.floor(Date.now() / 1000 + data.expires_in),
      };
    },
    session: ({ session, token }) => {
      session.user.id = token.userId;
      session.user.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
  },
});

declare module 'next-auth' {
  interface Session {
    user: {
      accessToken: string;
      id: string;
      name: string;
      image: string;
    };
    error?: 'RefreshTokenError';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    userId: string;
    error?: 'RefreshTokenError';
  }
}
