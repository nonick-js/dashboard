﻿import { Header } from '@/components/header';
import { requireDashboardAccessPermission } from '@/lib/api/utils';
import { reportSettingSchema } from '@/lib/database/src/schema/setting';
import { getChannels, getRoles } from '@/lib/discord/api';
import { sortChannels, sortRoles } from '@/lib/discord/utils';
import { db } from '@/lib/drizzle';
import type { Metadata } from 'next';
import type { SettingPageProps } from '../types';
import { SettingForm } from './form';

export const metadata: Metadata = {
  title: 'サーバー内通報',
};

export default async function ({ params }: SettingPageProps) {
  const { guildId } = await params;
  await requireDashboardAccessPermission(guildId);

  const [{ data: channels, error: channelsError }, { data: roles, error: rolesError }, setting] =
    await Promise.all([
      getChannels(guildId),
      getRoles(guildId),
      db.query.reportSetting.findFirst({
        where: (setting, { eq }) => eq(setting.guildId, guildId),
      }),
    ]);

  if (channelsError || rolesError) {
    throw new Error('Failed to load data');
  }

  return (
    <>
      <Header
        title='サーバー内通報'
        description='不適切なメッセージやユーザーをメンバーが通報できるようにします。'
      />
      <SettingForm
        channels={sortChannels(channels)}
        roles={sortRoles(roles)}
        setting={reportSettingSchema.form.safeParse(setting).data ?? null}
      />
    </>
  );
}
