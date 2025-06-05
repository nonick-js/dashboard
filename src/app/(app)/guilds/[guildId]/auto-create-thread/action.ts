'use server';

import { auditLog } from '@/lib/database/src/schema/audit-log';
import {
  autoCreateThreadSetting,
  autoCreateThreadSettingSchema,
} from '@/lib/database/src/schema/setting';
import { db } from '@/lib/drizzle';
import { guildActionClient } from '@/lib/safe-action/client';

export const updateSettingAction = guildActionClient
  .inputSchema(autoCreateThreadSettingSchema.form)
  .action(async ({ parsedInput, bindArgsParsedInputs, ctx }) => {
    try {
      if (!ctx.session) throw new Error('Unauthorized');
      const guildId = bindArgsParsedInputs[0];

      const oldValue = await db.query.autoCreateThreadSetting.findFirst({
        where: (setting, { eq }) => eq(setting.guildId, guildId),
      });

      const [newValue] = await db
        .insert(autoCreateThreadSetting)
        .values({ guildId, ...parsedInput })
        .onConflictDoUpdate({ target: autoCreateThreadSetting.guildId, set: parsedInput })
        .returning();

      await db.insert(auditLog).values({
        guildId: guildId,
        authorId: ctx.session.user.id,
        targetName: 'auto_create_thread',
        actionType: 'update_guild_setting',
        oldValue,
        newValue,
      });
      return { success: true };
    } catch {
      return { success: false };
    }
  });
