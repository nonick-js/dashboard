import 'server-only';

import {
  type APIGuild,
  type APIGuildChannel,
  type APIGuildMember,
  type APIRole,
  type GuildChannelType,
  PermissionFlagsBits,
  type RESTAPIPartialCurrentUserGuild,
} from 'discord-api-types/v10';
import { db } from '../drizzle';
import { DiscordEndPoints } from './constants';
import { discordBotUserFetch, discordOAuth2UserFetch } from './fetcher';
import { hasPermission, sortChannels } from './utils';

/** Botの招待URL */
export const inviteUrl = `${DiscordEndPoints.OAuth2}/authorize?${new URLSearchParams({
  client_id: process.env.AUTH_DISCORD_ID,
  scope: 'bot applications.commands',
  permissions: process.env.DISCORD_INVITE_PERMISSION,
  response_type: 'code',
  redirect_uri: process.env.AUTH_URL,
})}` as const;

/**
 * ユーザーが参加しているDiscordサーバーを取得
 * @param withCounts `true`の場合、サーバーのおおよそのメンバー数が{@link RESTAPIPartialCurrentUserGuild}に含まれるようになる
 * @see https://discord.com/developers/docs/resources/user#get-current-user-guilds
 */
export async function getUserGuilds(withCounts = false) {
  return discordOAuth2UserFetch<RESTAPIPartialCurrentUserGuild[]>(
    `/users/@me/guilds?with_counts=${withCounts}`,
  );
}

/**
 * Botとユーザーが参加しているDiscordサーバーを取得
 * @param withCounts `true`の場合、サーバーのおおよそのメンバー数が{@link RESTAPIPartialCurrentUserGuild}に含まれるようになる
 * @see {@link getUserGuilds}
 */
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

/**
 * ユーザーが`MANAGED_GUILD`権限を所有しており、かつBotとユーザーが参加しているDiscordサーバーを取得
 * @param withCounts `true`の場合、サーバーのおおよそのメンバー数が{@link RESTAPIPartialCurrentUserGuild}に含まれるようになる
 * @see {@link getMutualGuilds}
 */
export async function getMutualManagedGuilds(withCounts = false) {
  const mutualGuilds = await getMutualGuilds(withCounts);
  if (mutualGuilds.error) return mutualGuilds;

  const mutualManagedGuilds = mutualGuilds.data.filter((guild) =>
    hasPermission(guild.permissions, PermissionFlagsBits.ManageGuild),
  );

  mutualGuilds.data = mutualManagedGuilds;
  return mutualGuilds;
}

/**
 * Discordサーバーを取得
 * @param guildId サーバーID
 * @param withCounts `true`の場合、サーバーのおおよそのメンバー数が{@link APIGuild}に含まれるようになる
 * @see https://discord.com/developers/docs/resources/guild#get-guild
 */
export async function getGuild(guildId: string, withCounts = false) {
  return discordBotUserFetch<APIGuild>(`/guilds/${guildId}?with_counts=${withCounts}`);
}

/**
 * Discordサーバーのチャンネルを取得
 * @param guildId サーバーID
 * @see https://discord.com/developers/docs/resources/guild#get-guild-channels
 */
export async function getChannels(guildId: string) {
  const channels = await discordBotUserFetch<APIGuildChannel<GuildChannelType>[]>(
    `/guilds/${guildId}/channels`,
  );
  if (channels.error) return channels;

  channels.data = sortChannels(channels.data);
  return channels;
}

/**
 * Discordサーバーのロールを取得
 * @param guildId サーバーID
 * @see https://discord.com/developers/docs/resources/guild#get-guild-roles
 */
export async function getRoles(guildId: string) {
  const roles = await discordBotUserFetch<APIRole[]>(`/guilds/${guildId}/roles`);
  if (roles.error) return roles;

  roles.data = roles.data.sort((a, b) => b.position - a.position);
  return roles;
}

/**
 * Discordサーバーに参加しているメンバーを取得
 * @param guildId サーバーID
 * @param userId ユーザーID
 * @see https://discord.com/developers/docs/resources/guild#get-guild-member
 */
export async function getGuildMember(guildId: string, userId: string) {
  return discordBotUserFetch<APIGuildMember>(`/guilds/${guildId}/members/${userId}`);
}
