﻿'use server';

import { createInsertSchema } from '@/lib/database/src/lib/drizzle';
import { reportSetting } from '@/lib/database/src/schema/setting';
import { updateGuildSetting } from '@/lib/safe-action/action/update-guild-setting';
import { createGuildDatabaseAdapter } from '@/lib/safe-action/action/utils';
import { guildActionClient } from '@/lib/safe-action/client';
import { reportSettingFormSchema } from './schema';

export const updateReportSettingAction = guildActionClient
  .schema(async (prevSchema) => prevSchema.and(reportSettingFormSchema))
  .action(async ({ parsedInput: { guildId, ...input }, ctx }) => {
    await updateGuildSetting(
      guildId,
      input,
      ctx,
      createGuildDatabaseAdapter({
        metadata: { targetName: 'report' },
        table: reportSetting,
        guildIdColumn: reportSetting.guildId,
        dbSchema: createInsertSchema(reportSetting),
        formSchema: reportSettingFormSchema,
      }),
    );
    return { success: true };
  });
