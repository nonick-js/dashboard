import * as z from 'zod';
import { Snowflake } from './util';

const AuditLog = z.object({
  guildId: Snowflake,
  authorId: Snowflake,
  target: z.string(),
  before: z.any(),
  after: z.any(),
  createAt: z.date().optional(),
});

export default AuditLog;
