declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * データベースの接続URL
     */
    readonly DATABASE_URL: string;

    /**
     * データベースのコレクション名
     */
    readonly DATABASE_NAME: string;

    /**
     * @see https://authjs.dev/getting-started/deployment#auth_url
     */
    readonly AUTH_URL: string;

    /**
     * @see https://authjs.dev/getting-started/deployment#auth_secret
     */
    readonly AUTH_SECRET: string;

    /**
     * @see https://authjs.dev/guides/environment-variables#environment-variable-inference
     */
    readonly AUTH_DISCORD_ID: string;

    /**
     * @see https://authjs.dev/guides/environment-variables#environment-variable-inference
     */
    readonly AUTH_DISCORD_SECRET: string;

    /**
     * DiscordBotのトークン
     */
    readonly DISCORD_TOKEN: string;

    /**
     * DiscordBotの招待リンクに含める権限
     */
    readonly DISCORD_INVITE_PERMISSION: string;
  }
}
