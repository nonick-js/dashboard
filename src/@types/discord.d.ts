import type { APIGuildChannel, ChannelType } from 'discord-api-types/v10';

export type GuildChannel = APIGuildChannel<
  Exclude<ChannelType, 'DM' | 'GroupDM'>
>;
