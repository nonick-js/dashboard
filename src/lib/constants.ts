export namespace Discord {
  export const Endpoints = {
    API: 'https://discord.com/api/v10',
    CDN: 'https://cdn.discordapp.com',
  } as const;

  export const Permissions = {
    Administrator: 0x08,
    ManageGuild: 0x20,
  } as const;

  export const Regex = {
    Snowflake: /^\d{17,20}$/,
  } as const;
}

export namespace TailwindCSS {
  export const MediaQuery = {
    sm: '(min-width: 640px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
    xl: '(min-width: 1280px)',
  } as const;
}
