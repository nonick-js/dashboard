'use server';

import { AutoCreateThreadModel } from '@/lib/database/mongoose';
import { AutoCreateThreadZodSchema } from '@/lib/database/zod';
import { ActionType, dashboardActionClient } from '@/lib/safe-action';
import { revalidatePath } from 'next/cache';

export const updateSetting = dashboardActionClient
  .schema(async (prevSchema) => prevSchema.and(AutoCreateThreadZodSchema))
  .metadata({ actionType: ActionType.updateSetting })
  .action(async ({ parsedInput }) => {
    await AutoCreateThreadModel.updateOne(
      { guildId: parsedInput.guildId },
      { $set: parsedInput },
      { upsert: true },
    );

    revalidatePath('/');
    return { success: true };
  });
