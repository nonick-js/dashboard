'use server';

import { MessageExpandModel } from '@/lib/database/mongoose';
import { MessageExpandZodSchema } from '@/lib/database/zod';
import { ActionType, dashboardActionClient } from '@/lib/safe-action';
import { revalidatePath } from 'next/cache';

export const updateSetting = dashboardActionClient
  .schema(async (prevSchema) => prevSchema.and(MessageExpandZodSchema))
  .metadata({ actionType: ActionType.updateSetting })
  .action(async ({ parsedInput }) => {
    await MessageExpandModel.updateOne(
      { guildId: parsedInput.guildId },
      { $set: parsedInput },
      { upsert: true },
    );

    revalidatePath('/');
    return { success: true };
  });
