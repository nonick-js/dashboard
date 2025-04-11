import 'server-only';

import type { RESTPostOAuth2AccessTokenResult } from 'discord-api-types/v10';
import NextAuth, { type DefaultSession } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import discord, { type DiscordProfile } from 'next-auth/providers/discord';
import { NextResponse } from 'next/server';
import { discordFetch } from './discord/fetch';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    discord({
      authorization: 'https://discord.com/api/oauth2/authorize?scope=identify+guilds',
      profile: (profile: DiscordProfile) => {
        if (profile.avatar === null) {
          const defaultAvatarNumber =
            profile.discriminator === '0'
              ? Number(BigInt(profile.id) >> BigInt(22)) % 6
              : Number.parseInt(profile.discriminator) % 5;
          profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
        } else {
          const format = profile.avatar.startsWith('a_') ? 'gif' : 'png';
          profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
        }
        return {
          id: profile.id,
          image: profile.image_url,
          name: profile.global_name ?? profile.username,
          username: profile.username,
          discriminator: profile.discriminator,
        };
      },
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
    jwt: async ({ token, account, user }) => {
      if (account && user) {
        token.userId = account.providerAccountId;
        token.username = user.username;
        token.discriminator = user.discriminator;
        token.accessToken = account.access_token as string;
        token.refreshToken = account.refresh_token as string;
        token.expiresAt = account.expires_at as number;
        return token;
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

      token.accessToken = data.access_token;
      token.refreshToken = data.refresh_token;
      token.expiresAt = Math.floor(Date.now() / 1000 + data.expires_in);
      return token;
    },
    session: ({ session, token }) => {
      session.user.id = token.userId;
      session.user.username = token.username;
      session.user.discriminator = token.discriminator;
      session.user.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
  },
});

declare module 'next-auth' {
  interface User {
    username: string;
    discriminator: string;
  }
  interface Session {
    user: DefaultSession['user'] & {
      id: string;
      name: string;
      image: string;
      accessToken: string;
    };
    error?: 'RefreshTokenError';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    // user
    userId: string;
    username: string;
    discriminator: string;

    // accounts
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    error?: 'RefreshTokenError';
  }
}
