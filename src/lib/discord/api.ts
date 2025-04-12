import 'server-only';

import { PermissionFlagsBits, type RESTAPIPartialCurrentUserGuild } from 'discord-api-types/v10';
import { db } from '../drizzle';
import { discordOAuth2UserFetch } from './fetcher';
import { DiscordEndPoints, hasPermission } from './utils';

export const inviteUrl = `${DiscordEndPoints.OAuth2}/authorize?${new URLSearchParams({
  client_id: process.env.AUTH_DISCORD_ID,
  scope: 'bot applications.commands',
  permissions: process.env.DISCORD_INVITE_PERMISSION,
  response_type: 'code',
  redirect_uri: process.env.AUTH_URL,
})}` as const;

/** ユーザーが参加しているDiscordサーバーを取得 */
export async function getUserGuilds(withCounts = false) {
  return discordOAuth2UserFetch<RESTAPIPartialCurrentUserGuild[]>(
    `/users/@me/guilds?with_counts=${withCounts}`,
  );
}

/** Botとユーザーが参加しているDiscordサーバーを取得 */
export async function getMutualGuilds(withCounts = false) {
  const userGuilds = await getUserGuilds(withCounts);
  if (userGuilds.error) return userGuilds;

  const mutualGuilds = await db.query.guild.findMany({
    where: (guild, { inArray }) =>
      inArray(
        guild.id,
        userGuilds.data.map((v) => v.id),
      ),
  });
  const mutualGuildIds = mutualGuilds.map((guild) => guild.id);

  userGuilds.data = userGuilds.data.filter((guild) => mutualGuildIds.includes(guild.id));
  return userGuilds;
}

/** ユーザーが`MANAGED_GUILD`権限を所有しており、かつBotとユーザーが参加しているDiscordサーバーを取得 */
export async function getMutualManagedGuilds(withCounts = false) {
  const mutualGuilds = await getMutualGuilds(withCounts);
  if (mutualGuilds.error) return mutualGuilds;

  const mutualManagedGuilds = mutualGuilds.data.filter((guild) =>
    hasPermission(guild.permissions, PermissionFlagsBits.ManageGuild),
  );

  mutualGuilds.data = mutualManagedGuilds;
  return mutualGuilds;
}
