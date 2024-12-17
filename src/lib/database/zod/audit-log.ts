import * as z from 'zod';
import { Snowflake } from './lib/discord';

const AuditLogZodSchema = z.object({
  guildId: Snowflake,
  authorId: Snowflake,
  before: z.any(),
  after: z.any(),
  createAt: z.date().optional(),
  reason: z.string().optional(),
});

export default AuditLogZodSchema;
