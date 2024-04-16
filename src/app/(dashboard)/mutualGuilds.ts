import { auth } from '@/auth';
import { Guild } from '@/database/models';
import { Discord } from '@/lib/constants';
import { getUserGuilds, hasPermission } from '@/lib/discord';
import { dbConnect } from '@/lib/mongoose';
import type { RESTAPIPartialCurrentUserGuild } from 'discord-api-types/v10';

export async function getMutualGuilds(): Promise<
  RESTAPIPartialCurrentUserGuild[]
> {
  const session = await auth();
  if (!session?.accessToken) return [];

  const userGuilds = await getUserGuilds(session.accessToken);

  const userManagedGuildIds = userGuilds
    .filter((guild) =>
      hasPermission(guild.permissions, Discord.Permissions.ManageGuild),
    )
    .map((guild) => guild.id);

  await dbConnect();
  const mutualGuildIds = await Guild.find({
    guildId: { $in: userManagedGuildIds },
  }).then((guilds) => guilds.map((guild) => guild.guildId));

  return userGuilds.filter((guild) => mutualGuildIds.includes(guild.id));
}
