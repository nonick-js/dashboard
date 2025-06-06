import { createInsertSchema } from '@/lib/database/src/lib/drizzle';
import { reportSetting } from '@/lib/database/src/schema/setting';
import { isUniqueArray } from '@/lib/database/src/utils/zod';
import { snowflakeRegex } from '@/lib/database/src/utils/zod/discord';
import { z } from '@/lib/zod/i18n';

export const settingFormSchema = createInsertSchema(reportSetting, {
  channel: (schema) => schema.regex(snowflakeRegex),
  forumCompletedTag: (schema) => schema.regex(snowflakeRegex),
  forumIgnoredTag: (schema) => schema.regex(snowflakeRegex),
  mentionRoles: z
    .array(z.string().regex(snowflakeRegex))
    .max(100)
    .refine(isUniqueArray, { message: '重複した値が含まれています。' }),
})
  .omit({ guildId: true, createdAt: true, updatedAt: true })
  .superRefine((v, ctx) => {
    if (v.enableMention && !v.mentionRoles.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'ロールが設定されていません。',
        path: ['mentionRoles'],
      });
    }
  });
