import NextAuth, { type DefaultSession } from 'next-auth';
import discord from 'next-auth/providers/discord';
import 'next-auth/jwt';
import type { RESTPostOAuth2AccessTokenResult } from 'discord-api-types/v10';
import { NextResponse, URLPattern } from 'next/server';
import { Snowflake } from './lib/database/zod/lib/discord';

// #region Config
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    discord({ authorization: 'https://discord.com/api/oauth2/authorize?scope=identify+guilds' }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized: ({ auth, request }) => {
      // 既にログインしている場合はサーバー選択ページにリダイレクトする
      if (auth?.user && request.nextUrl.pathname === '/login') {
        return NextResponse.redirect(new URL('/', request.nextUrl.origin));
      }

      // ダッシュボードにアクセス時、有効なサーバーIDでない場合はサーバー選択ページにリダイレクトする
      if (auth?.user && request.nextUrl.pathname.startsWith('/guilds')) {
        const match = new URLPattern({ pathname: '/guilds/:guildId/:segment*' }).exec(
          request.nextUrl,
        );
        const guildId = match?.pathname.groups.guildId;

        if (!Snowflake.safeParse(guildId).success) {
          return NextResponse.redirect(new URL('/', request.nextUrl.origin));
        }
      }

      // ログインしていない場合はログインページにリダイレクトする
      return !!auth?.user;
    },
    jwt: async ({ token, account }) => {
      // 初回ログイン時にアクセストークンとリフレッシュトークンをJWTトークンに保存する
      if (account?.access_token && account.expires_at) {
        return {
          ...token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token,
          user_id: account.providerAccountId,
        };
      }

      // アクセストークンが有効だった場合はそのままJWTトークンを返す
      if (Date.now() < token.expires_at * 1000) {
        return token;
      }

      // アクセストークンが期限切れだった場合、アクセストークンを更新してJWTトークンを返す
      if (!token.refresh_token) throw new TypeError('Missing refresh_token');

      try {
        // https://discord.com/developers/docs/topics/oauth2#authorization-code-grant-refresh-token-exchange-example
        const res = await fetch('https://discord.com/api/v10/oauth2/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: process.env.AUTH_DISCORD_ID,
            client_secret: process.env.AUTH_DISCORD_SECRET,
            grant_type: 'refresh_token',
            refresh_token: token.refresh_token,
          }),
        });

        const tokenOrError = await res.json<RESTPostOAuth2AccessTokenResult>();
        if (!res.ok) throw tokenOrError;

        token.access_token = tokenOrError.access_token;
        token.expires_at = Math.floor(Date.now() / 1000 + tokenOrError.expires_in);
        token.refresh_token = tokenOrError.refresh_token;
        return token;
      } catch (e) {
        console.error('Error refreshing access_token', e);
        token.error = 'RefreshTokenError';
        return token;
      }
    },
    session: ({ session, token }) => {
      if (token.error) session.error = token.error;
      session.user.accessToken = token.access_token;
      session.user.id = token.user_id;
      return session;
    },
  },
});
// #endregion

// #region Types
declare module 'next-auth' {
  interface Session {
    user: {
      accessToken: string;
      id: string;
      name: string;
      image: string;
    } & DefaultSession['user'];
    error?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    access_token: string;
    expires_at: number;
    user_id: string;
    refresh_token?: string;
    error?: string;
  }
}
// #endregion
