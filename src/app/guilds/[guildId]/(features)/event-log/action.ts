'use server';

import { EventLogModel } from '@/lib/database/mongoose';
import { EventLogZodSchema } from '@/lib/database/zod';
import { ActionType, dashboardActionClient } from '@/lib/safe-action';
import { revalidatePath } from 'next/cache';

export const updateSetting = dashboardActionClient
  .schema(async (prevSchema) => prevSchema.and(EventLogZodSchema))
  .metadata({ actionType: ActionType.updateSetting })
  .action(async ({ parsedInput }) => {
    await EventLogModel.updateOne(
      { guildId: parsedInput.guildId },
      { $set: parsedInput },
      { upsert: true },
    );

    revalidatePath('/');
    return { success: true };
  });
