import { z } from 'zod';
import { Snowflake } from './lib/discord';

const AutoCreateThreadZodSchema = z.object({
  enabled: z.boolean(),
  channels: z.array(Snowflake),
});

export default AutoCreateThreadZodSchema;
