﻿declare namespace NodeJS {
  interface ProcessEnv {
    readonly DATABASE_URL: string;
    readonly AUTH_SECRET: string;
    readonly AUTH_URL: string;
    readonly AUTH_DISCORD_ID: string;
    readonly AUTH_DISCORD_SECRET: string;
  }
}
