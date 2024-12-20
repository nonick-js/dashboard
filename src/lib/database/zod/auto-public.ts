import { z } from 'zod';
import { Snowflake } from './lib/discord';

const AutoPublicZodSchema = z.object({
  enabled: z.boolean(),
  channels: z.array(Snowflake),
});

export default AutoPublicZodSchema;
