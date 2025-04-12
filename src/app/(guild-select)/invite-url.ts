import 'server-only';

import { DiscordEndPoints } from '@/lib/discord/utils';

export const inviteUrl = `${DiscordEndPoints.OAuth2}/authorize?${new URLSearchParams({
  client_id: process.env.AUTH_DISCORD_ID,
  scope: 'bot applications.commands',
  permissions: process.env.DISCORD_INVITE_PERMISSION,
  response_type: 'code',
  redirect_uri: process.env.AUTH_URL,
})}`;
