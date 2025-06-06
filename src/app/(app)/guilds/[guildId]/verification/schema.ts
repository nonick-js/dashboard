import { createInsertSchema } from '@/lib/database/src/lib/drizzle';
import { verificationSetting } from '@/lib/database/src/schema/setting';
import { snowflakeRegex } from '@/lib/database/src/utils/zod/discord';
import { z } from 'zod';

export const settingFormSchema = createInsertSchema(verificationSetting, {
  role: (s) => s.regex(snowflakeRegex),
})
  .omit({ guildId: true, createdAt: true, updatedAt: true })
  .superRefine((v, ctx) => {
    if (v.enabled && !v.role) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'ロールが設定されていません。',
        path: ['role'],
      });
    }
  });
