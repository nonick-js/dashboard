declare namespace NodeJS {
  interface ProcessEnv extends Env {
    NEXT_PUBLIC_DISCORD_ID: string;
    NEXT_PUBLIC_DISCORD_PERMISSION: string;
    NEXT_PUBLIC_BASEURL: string;

    // prisma
    readonly DATABASE_URL: string;

    // next-auth
    readonly AUTH_SECRET: string;
    readonly AUTH_DISCORD_ID: string;
    readonly AUTH_DISCORD_SECRET: string;
  }
}
