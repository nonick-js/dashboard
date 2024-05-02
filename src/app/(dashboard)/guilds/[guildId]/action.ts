'use server';

import { auth } from '@/auth';
import type { ToasterToast } from '@/components/ui/use-toast';
import * as model from '@/database/models';
import * as schema from '@/database/zod/config';
import { isGuildAdmin } from '@/lib/discord';
import { wait } from '@/lib/utils';
import type { Model } from 'mongoose';
import { revalidatePath } from 'next/cache';
import type * as z from 'zod';

const Configs = {
  autoChangeVerifyLevel: {
    model: model.AutoChangeVerifyLevelConfig,
    schema: schema.AutoChangeVerifyLevelConfig,
  },
  autoCreateThread: { model: model.AutoCreateThreadConfig, schema: schema.AutoCreateThreadConfig },
  autoMod: { model: model.AutoModConfig, schema: schema.AutoModConfig },
  autoPublic: { model: model.AutoPublicConfig, schema: schema.AutoPublicConfig },
  eventLog: { model: model.EventLogConfig, schema: schema.EventLogConfig },
  joinMessage: { model: model.JoinMessageConfig, schema: schema.JoinMessageConfig },
  leaveMessage: { model: model.LeaveMessageConfig, schema: schema.LeaveMessageConfig },
  messageExpand: { model: model.MessageExpandConfig, schema: schema.MessageExpandConfig },
  report: { model: model.ReportConfig, schema: schema.ReportConfig },
};

type updateSettingResult = {
  message: Omit<ToasterToast, 'id'>;
  isSuccess: boolean;
};

export async function updateConfig<
  T extends keyof typeof Configs,
  U extends z.infer<(typeof Configs)[T]['schema']>,
>(target: T, value: U): Promise<updateSettingResult> {
  try {
    if (!(target in Configs)) throw new Error('Invalid Model Name');

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const targetModel = Configs[target].model as unknown as Model<any>;
    const targetSchema = Configs[target].schema;

    if (!targetSchema.safeParse(value).success) throw new Error('Invalid Value');

    if (!(await model.Guild.findOne({ guildId: value.guildId })))
      throw new Error('Guild Not Found');

    const session = await auth();
    if (!session?.accessToken) throw new Error('Unauthorized');
    if (!(await isGuildAdmin(value.guildId, session.accessToken)))
      throw new Error('Invalid Permission');

    // const beforeConfig = await targetModel.findOne({ guildId: value.guildId });
    await targetModel
      .updateOne({ guildId: value.guildId }, { $set: value }, { new: true, upsert: true })
      .exec();

    revalidatePath('/');

    // await model.AuditLog.create({
    //   guildId: value.guildId,
    //   authorId: session.user?.id,
    //   before: targetSchema.parse(beforeConfig),
    //   after: value, // already parsed
    // });

    await wait(1000); // cooldown

    return {
      isSuccess: true,
      message: {
        title: '設定を保存しました！',
        variant: 'success',
      },
    };
  } catch (e) {
    return {
      isSuccess: false,
      message: {
        title: '設定の保存に失敗しました。',
        description: String(e),
        variant: 'destructive',
      },
    };
  }
}
