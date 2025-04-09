declare namespace NodeJS {
  interface ProcessEnv {
    readonly DATABASE_URL: string;
    readonly BETTER_AUTH_SECRET: string;
    readonly BETTER_AUTH_URL: string;
    readonly DISCORD_CLIENT_ID: string;
    readonly DISCORD_CLIENT_SECRET: string;
  }
}
