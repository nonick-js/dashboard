import { createGuildDatabaseAdapter, updateGuildSetting } from '@/lib/api/handler';
import { reportSetting, reportSettingSchema } from '@/lib/database/src/schema/setting';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ guildId: string; feature: string }> },
) {
  const { guildId, feature } = await params;

  if (feature === 'report') {
    return updateGuildSetting(
      req,
      guildId,
      createGuildDatabaseAdapter({
        metadata: { targetName: 'report' },
        table: reportSetting,
        guildIdColumn: reportSetting.guildId,
        dbSchema: reportSettingSchema.db,
        formSchema: reportSettingSchema.form,
      }),
    );
  }

  return NextResponse.json({ message: 'Feature not found' }, { status: 404 });
}
