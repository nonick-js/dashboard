import { z } from 'zod';
import { MessageOptions, Snowflake } from './lib/discord';

const LeaveMessageZodSchema = z
  .object({
    enabled: z.boolean(),
    channel: Snowflake.nullable(),
    message: MessageOptions,
    ignoreBot: z.boolean(),
  })
  .superRefine((v, ctx) => {
    if (v.enabled && !v.channel) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'チャンネルが設定されていません',
        path: ['channel'],
      });
    }
  });

export default LeaveMessageZodSchema;
