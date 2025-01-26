'use server';

import { MessageExpandModel } from '@/lib/database/mongoose';
import { MessageExpandZodSchema } from '@/lib/database/zod';
import { dashboardActionClient } from '@/lib/safe-action';
import { revalidatePath } from 'next/cache';

export const updateConfig = dashboardActionClient
  .schema(async (prevSchema) => prevSchema.and(MessageExpandZodSchema))
  .metadata({ actionName: 'updateConfig' })
  .action(async ({ parsedInput }) => {
    await MessageExpandModel.updateOne(
      { guildId: parsedInput.guildId },
      { $set: parsedInput },
      { upsert: true },
    );

    revalidatePath('/');
    return { success: true };
  });
