import { auth } from '@/auth';
import { Discord } from '@/lib/constants';
import { getUserGuilds, hasPermission } from '@/lib/discord';
import prisma from '@/lib/prisma';
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

  const mutualGuildIds = await prisma.guild
    .findMany({
      where: {
        guildId: { in: userManagedGuildIds },
      },
    })
    .then((guilds) => guilds.map((guild) => guild.guildId));

  return userGuilds.filter((guild) => mutualGuildIds.includes(guild.id));
}
