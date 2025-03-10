import type { RESTPostOAuth2AccessTokenResult } from 'discord-api-types/v10';
import NextAuth, { type DefaultSession } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import Discord from 'next-auth/providers/discord';

// #region Config
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Discord({
      authorization:
        'https://discord.com/api/oauth2/authorize?scope=identify+guilds',
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
      if (!token.refreshToken) throw new TypeError('Missing refreshToken');

      try {
        const res = await fetch('https://discord.com/api/v10/oauth2/token', {
          method: 'POST',
          body: new URLSearchParams({
            client_id: process.env.AUTH_DISCORD_ID,
            client_secret: process.env.AUTH_DISCORD_SECRET,
            grant_type: 'refresh_token',
            refresh_token: token.refreshToken,
          }),
        });

        const tokenOrError = await res.json<RESTPostOAuth2AccessTokenResult>();
        if (!res.ok) throw tokenOrError;

        return {
          ...token,
          accessToken: tokenOrError.access_token,
          refreshToken: tokenOrError.refresh_token,
          expiresAt: Math.floor(Date.now() / 1000 + tokenOrError.expires_in),
        };
      } catch (e) {
        console.error('Error refreshing accessToken', e);
        token.error = 'RefreshTokenError';
        return token;
      }
    },
    session: ({ session, token }) => {
      session.error = token.error;
      session.user.userId = token.userId;
      session.user.accessToken = token.accessToken;
      return session;
    },
  },
});

// #region Types
declare module 'next-auth' {
  interface Session {
    user: {
      userId: string;
      name: string;
      image: string;
      accessToken: string;
    } & DefaultSession['user'];
    error?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    refreshToken?: string;
    expiresAt: number;
    userId: string;
    error?: string;
  }
}
// #endregion
