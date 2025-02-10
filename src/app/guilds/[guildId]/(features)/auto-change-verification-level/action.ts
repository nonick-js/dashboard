'use server';

import { AutoChangeVerifyLevelModel } from '@/lib/database/mongoose';
import { AutoChangeVerifyLevelZodSchema } from '@/lib/database/zod';
import { ActionType, dashboardActionClient } from '@/lib/safe-action';
import { revalidatePath } from 'next/cache';

export const updateSetting = dashboardActionClient
  .schema(async (prevSchema) => prevSchema.and(AutoChangeVerifyLevelZodSchema))
  .metadata({ actionType: ActionType.updateSetting })
  .action(async ({ parsedInput }) => {
    await AutoChangeVerifyLevelModel.updateOne(
      { guildId: parsedInput.guildId },
      { $set: parsedInput },
      { upsert: true },
    );

    revalidatePath('/');
    return { success: true };
  });
