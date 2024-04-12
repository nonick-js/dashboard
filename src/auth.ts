import NextAuth from 'next-auth';
import Discord from 'next-auth/providers/discord';

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
    jwt: ({ token, account }) => {
      if (account) {
        token.accessToken = account.access_token;
        token.accessTokenExpires = account.expires_at;
        token.userId = account.providerAccountId;
      }

      if (
        token.accessTokenExpires &&
        Date.now() > token.accessTokenExpires * 1000
      ) {
        token.error = 'invalid_token';
      }

      return token;
    },
    session: ({ session, token }) => {
      session.accessToken = token.accessToken;
      session.error = token.error;
      session.userId = token.userId;
      return session;
    },
  },
});
