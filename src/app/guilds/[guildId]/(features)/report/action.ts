'use server';

import { ReportModel } from '@/lib/database/mongoose';
import { ReportZodSchema } from '@/lib/database/zod';
import { dashboardActionClient } from '@/lib/safe-action';
import { revalidatePath } from 'next/cache';

export const updateSetting = dashboardActionClient
  .schema(async (prevSchema) => prevSchema.and(ReportZodSchema))
  .metadata({ actionName: 'updateConfig' })
  .action(async ({ parsedInput }) => {
    await ReportModel.updateOne(
      { guildId: parsedInput.guildId },
      { $set: parsedInput },
      { upsert: true },
    );

    revalidatePath('/');
    return { success: true };
  });
