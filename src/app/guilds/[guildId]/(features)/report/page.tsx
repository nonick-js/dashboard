import { Header } from '@/components/header';
import { ReportModel } from '@/lib/database/mongoose';
import { ReportZodSchema } from '@/lib/database/zod';
import { getChannels, getRoles, hasAccessDashboardPermission } from '@/lib/discord';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import type { SettingPageProps } from '../../types';
import { SettingForm } from './form';

export const metadata: Metadata = {
  title: 'サーバー内通報',
};

export default async function ({ params }: SettingPageProps) {
  const { guildId } = await params;
  if (!(await hasAccessDashboardPermission(guildId))) redirect('/');

  const [channels, roles, setting] = await Promise.all([
    getChannels(guildId),
    getRoles(guildId),
    ReportModel.findOne({ guildId }),
  ]);

  return (
    <>
      <Header
        title='サーバー内通報'
        description='不適切なメッセージやユーザーをメンバーが通報できるようにします。'
      />
      <SettingForm
        channels={channels}
        roles={roles}
        setting={ReportZodSchema.safeParse(setting).data ?? null}
      />
    </>
  );
}
