import { GuildVerificationLevel } from 'discord-api-types/v10';
import { z } from 'zod';
import { Snowflake } from './lib/discord';

const GuildZodSchema = z.object({
  guildId: Snowflake,
  beforeVerifyLevel: z.nativeEnum(GuildVerificationLevel),
  createAt: z.date(),
});

export default GuildZodSchema;
