declare namespace NodeJS {
  interface ProcessEnv extends Env {
    // next-auth
    readonly AUTH_SECRET: string;
    readonly AUTH_DISCORD_ID: string;
    readonly AUTH_DISCORD_SECRET: string;
  }
}
