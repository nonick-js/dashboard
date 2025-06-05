'use server';

import { auditLog } from '@/lib/database/src/schema/audit-log';
import { reportSetting } from '@/lib/database/src/schema/setting';
import { db } from '@/lib/drizzle';
import { guildActionClient } from '@/lib/safe-action/client';
import { reportSettingFormSchema } from './schema';

export const updateSettingAction = guildActionClient
  .inputSchema(reportSettingFormSchema)
  .action(async ({ parsedInput, bindArgsParsedInputs, ctx }) => {
    try {
      if (!ctx.session) throw new Error('Unauthorized');
      const guildId = bindArgsParsedInputs[0];

      const oldValue = await db.query.reportSetting.findFirst({
        where: (setting, { eq }) => eq(setting.guildId, guildId),
      });

      const [newValue] = await db
        .insert(reportSetting)
        .values({ guildId, ...parsedInput })
        .onConflictDoUpdate({ target: reportSetting.guildId, set: parsedInput })
        .returning();

      await db.insert(auditLog).values({
        guildId: guildId,
        authorId: ctx.session.user.id,
        targetName: 'report',
        actionType: 'update_guild_setting',
        oldValue,
        newValue,
      });
      return { success: true };
    } catch {
      return { success: false };
    }
  });
