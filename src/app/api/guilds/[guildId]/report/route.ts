import { createGuildDatabaseAdapter, updateGuildSetting } from '@/lib/api/handler';
import { reportSetting, reportSettingSchema } from '@/lib/database/src/schema/setting';

export function POST(req: Request, { params }: { params: Promise<{ guildId: string }> }) {
  return updateGuildSetting(
    req,
    params,
    createGuildDatabaseAdapter({
      metadata: { targetName: 'report' },
      table: reportSetting,
      guildIdColumn: reportSetting.guildId,
      dbSchema: reportSettingSchema.db,
      formSchema: reportSettingSchema.form,
    }),
  );
}
