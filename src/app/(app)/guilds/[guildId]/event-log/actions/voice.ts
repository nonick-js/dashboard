'use server';

import { auditLog } from '@/lib/database/src/schema/audit-log';
import { voiceLogSetting, voiceLogSettingSchema } from '@/lib/database/src/schema/setting';
import { db } from '@/lib/drizzle';
import { guildActionClient } from '@/lib/safe-action/client';
import { revalidatePath } from 'next/cache';

export const updateSettingAction = guildActionClient
  .inputSchema(voiceLogSettingSchema.form)
  .action(async ({ parsedInput, bindArgsParsedInputs, ctx }) => {
    try {
      if (!ctx.session) throw new Error('Unauthorized');
      const guildId = bindArgsParsedInputs[0];

      const oldValue = await db.query.voiceLogSetting.findFirst({
        where: (setting, { eq }) => eq(setting.guildId, guildId),
      });

      const [newValue] = await db
        .insert(voiceLogSetting)
        .values({ guildId, ...parsedInput })
        .onConflictDoUpdate({ target: voiceLogSetting.guildId, set: parsedInput })
        .returning();

      await db.insert(auditLog).values({
        guildId: guildId,
        authorId: ctx.session.user.id,
        targetName: 'voice_log',
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
