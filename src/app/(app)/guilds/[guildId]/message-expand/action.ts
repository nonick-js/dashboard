'use server';

import { auditLog } from '@/lib/database/src/schema/audit-log';
import { msgExpandSetting, msgExpandSettingSchema } from '@/lib/database/src/schema/setting';
import { db } from '@/lib/drizzle';
import { guildActionClient } from '@/lib/safe-action/client';

export const updateSettingAction = guildActionClient
  .inputSchema(msgExpandSettingSchema.form)
  .action(async ({ parsedInput, bindArgsParsedInputs, ctx }) => {
    try {
      if (!ctx.session) throw new Error('Unauthorized');
      const guildId = bindArgsParsedInputs[0];

      const oldValue = await db.query.msgExpandSetting.findFirst({
        where: (setting, { eq }) => eq(setting.guildId, guildId),
      });

      const [newValue] = await db
        .insert(msgExpandSetting)
        .values({ guildId, ...parsedInput })
        .onConflictDoUpdate({ target: msgExpandSetting.guildId, set: parsedInput })
        .returning();

      await db.insert(auditLog).values({
        guildId: guildId,
        authorId: ctx.session.user.id,
        targetName: 'message_expand',
        actionType: 'update_guild_setting',
        oldValue,
        newValue,
      });
      return { success: true };
    } catch {
      return { success: false };
    }
  });
