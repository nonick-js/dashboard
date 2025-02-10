'use server';

import { AutoPublicModel } from '@/lib/database/mongoose';
import { AutoPublicZodSchema } from '@/lib/database/zod';
import { ActionType, dashboardActionClient } from '@/lib/safe-action';
import { revalidatePath } from 'next/cache';

export const updateSetting = dashboardActionClient
  .schema(async (prevSchema) => prevSchema.and(AutoPublicZodSchema))
  .metadata({ actionType: ActionType.updateSetting })
  .action(async ({ parsedInput }) => {
    await AutoPublicModel.updateOne(
      { guildId: parsedInput.guildId },
      { $set: parsedInput },
      { upsert: true },
    );

    revalidatePath('/');
    return { success: true };
  });
