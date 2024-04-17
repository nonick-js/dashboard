declare namespace NodeJS {
  interface ProcessEnv extends Env {
    readonly NEXT_PUBLIC_DISCORD_ID: string;
    readonly NEXT_PUBLIC_DISCORD_PERMISSION: string;
    readonly NEXT_PUBLIC_BASEURL: string;
    readonly NEXT_PUBLIC_DEV_MODE?: 0 | 1;

    // discord
    readonly DISCORD_TOKEN: string;

    // mongoose
    readonly DATABASE_URL: string;
    readonly DATABASE_NAME: string;

    // next-auth
    readonly AUTH_SECRET: string;
    readonly AUTH_DISCORD_ID: string;
    readonly AUTH_DISCORD_SECRET: string;
  }
}
