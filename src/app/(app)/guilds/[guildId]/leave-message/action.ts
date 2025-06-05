'use server';

import { auditLog } from '@/lib/database/src/schema/audit-log';
import { leaveMessageSetting, leaveMessageSettingSchema } from '@/lib/database/src/schema/setting';
import { db } from '@/lib/drizzle';
import { guildActionClient } from '@/lib/safe-action/client';

export const updateSettingAction = guildActionClient
  .inputSchema(leaveMessageSettingSchema.form)
  .action(async ({ parsedInput, bindArgsParsedInputs, ctx }) => {
    try {
      if (!ctx.session) throw new Error('Unauthorized');
      const guildId = bindArgsParsedInputs[0];

      const oldValue = await db.query.leaveMessageSetting.findFirst({
        where: (setting, { eq }) => eq(setting.guildId, guildId),
      });

      const [newValue] = await db
        .insert(leaveMessageSetting)
        .values({ guildId, ...parsedInput })
        .onConflictDoUpdate({ target: leaveMessageSetting.guildId, set: parsedInput })
        .returning();

      await db.insert(auditLog).values({
        guildId: guildId,
        authorId: ctx.session.user.id,
        targetName: 'leave_message',
        actionType: 'update_guild_setting',
        oldValue,
        newValue,
      });
      return { success: true };
    } catch {
      return { success: false };
    }
  });
