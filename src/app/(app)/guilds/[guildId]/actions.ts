﻿'use server';

import {
  msgExpandSetting,
  msgExpandSettingSchema,
  reportSetting,
  reportSettingSchema,
} from '@/lib/database/src/schema/setting';
import { updateGuildSetting } from '@/lib/safe-action/action/update-guild-setting';
import { createGuildDatabaseAdapter } from '@/lib/safe-action/action/utils';
import { guildActionClient } from '@/lib/safe-action/client';

export const updateReportSettingAction = guildActionClient
  .schema(async (prevSchema) => prevSchema.and(reportSettingSchema.form))
  .action(async ({ parsedInput: { guildId, ...input }, ctx }) => {
    await updateGuildSetting(
      guildId,
      input,
      ctx,
      createGuildDatabaseAdapter({
        metadata: { targetName: 'report' },
        table: reportSetting,
        guildIdColumn: reportSetting.guildId,
        dbSchema: reportSettingSchema.db,
        formSchema: reportSettingSchema.form,
      }),
    );
    return { success: true };
  });

export const updateMsgExpandSettingAction = guildActionClient
  .schema(async (prevSchema) => prevSchema.and(msgExpandSettingSchema.form))
  .action(async ({ parsedInput: { guildId, ...input }, ctx }) => {
    await updateGuildSetting(
      guildId,
      input,
      ctx,
      createGuildDatabaseAdapter({
        metadata: { targetName: 'message_expand' },
        table: msgExpandSetting,
        guildIdColumn: msgExpandSetting.guildId,
        dbSchema: msgExpandSettingSchema.db,
        formSchema: msgExpandSettingSchema.form,
      }),
    );
    return { success: true };
  });
