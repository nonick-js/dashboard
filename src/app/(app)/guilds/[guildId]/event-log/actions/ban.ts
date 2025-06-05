'use server';

import { auditLog } from '@/lib/database/src/schema/audit-log';
import { banLogSetting, banLogSettingSchema } from '@/lib/database/src/schema/setting';
import { db } from '@/lib/drizzle';
import { guildActionClient } from '@/lib/safe-action/client';
import { revalidatePath } from 'next/cache';

export const updateSettingAction = guildActionClient
  .inputSchema(banLogSettingSchema.form)
  .action(async ({ parsedInput, bindArgsParsedInputs, ctx }) => {
    try {
      if (!ctx.session) throw new Error('Unauthorized');
      const guildId = bindArgsParsedInputs[0];

      const oldValue = await db.query.banLogSetting.findFirst({
        where: (setting, { eq }) => eq(setting.guildId, guildId),
      });

      const [newValue] = await db
        .insert(banLogSetting)
        .values({ guildId, ...parsedInput })
        .onConflictDoUpdate({ target: banLogSetting.guildId, set: parsedInput })
        .returning();

      await db.insert(auditLog).values({
        guildId: guildId,
        authorId: ctx.session.user.id,
        targetName: 'ban_log',
        actionType: 'update_guild_setting',
        oldValue,
        newValue,
      });

      revalidatePath('/');

      return { success: true };
    } catch {
      return { success: false };
    }
  });
