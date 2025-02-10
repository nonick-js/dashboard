import { z } from 'zod';
import { MessageOptions, Snowflake } from './lib/discord';

const JoinMessageZodSchema = z
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

export default JoinMessageZodSchema;
