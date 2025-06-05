'use server';

import { auditLog } from '@/lib/database/src/schema/audit-log';
import { autoPublicSetting, autoPublicSettingSchema } from '@/lib/database/src/schema/setting';
import { db } from '@/lib/drizzle';
import { guildActionClient } from '@/lib/safe-action/client';

export const updateSettingAction = guildActionClient
  .inputSchema(autoPublicSettingSchema.form)
  .action(async ({ parsedInput, bindArgsParsedInputs, ctx }) => {
    try {
      if (!ctx.session) throw new Error('Unauthorized');
      const guildId = bindArgsParsedInputs[0];

      const oldValue = await db.query.autoPublicSetting.findFirst({
        where: (setting, { eq }) => eq(setting.guildId, guildId),
      });

      const [newValue] = await db
        .insert(autoPublicSetting)
        .values({ guildId, ...parsedInput })
        .onConflictDoUpdate({ target: autoPublicSetting.guildId, set: parsedInput })
        .returning();

      await db.insert(auditLog).values({
        guildId: guildId,
        authorId: ctx.session.user.id,
        targetName: 'auto_public',
        actionType: 'update_guild_setting',
        oldValue,
        newValue,
      });
    } catch (e) {
      if (e instanceof Error) {
        console.error(e);
        return {
          error: e.message,
        };
      }
    }
  });
