import { createGuildDatabaseAdapter, updateGuildSetting } from '@/lib/api/handler';
import {
  msgExpandSetting,
  msgExpandSettingSchema,
  reportSetting,
  reportSettingSchema,
} from '@/lib/database/src/schema/setting';
import { NextResponse } from 'next/server';
import type { ZodSchema } from 'zod';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ guildId: string; feature: string }> },
) {
  const { guildId, feature } = await params;

  const handleSettingUpdate = <FormSchema extends ZodSchema, DbSchema extends ZodSchema>(
    adapter: ReturnType<typeof createGuildDatabaseAdapter<FormSchema, DbSchema>>,
  ) => {
    return updateGuildSetting(req, guildId, adapter);
  };

  switch (feature) {
    case 'report':
      return handleSettingUpdate(
        createGuildDatabaseAdapter({
          metadata: { targetName: 'report' },
          table: reportSetting,
          guildIdColumn: reportSetting.guildId,
          dbSchema: reportSettingSchema.db,
          formSchema: reportSettingSchema.form,
        }),
      );
    case 'message-expand':
      return handleSettingUpdate(
        createGuildDatabaseAdapter({
          metadata: { targetName: 'message_expand' },
          table: msgExpandSetting,
          guildIdColumn: msgExpandSetting.guildId,
          dbSchema: msgExpandSettingSchema.db,
          formSchema: msgExpandSettingSchema.form,
        }),
      );
    default:
      return NextResponse.json({ error: '404: Not Found' }, { status: 404 });
  }
}
