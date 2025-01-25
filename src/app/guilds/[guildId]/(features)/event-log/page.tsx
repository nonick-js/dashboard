import { Header } from '@/components/header';
import { EventLogModel } from '@/lib/database/mongoose';
import { EventLogZodSchema } from '@/lib/database/zod';
import { getChannels, hasAccessDashboardPermission } from '@/lib/discord';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import type { SettingPageProps } from '../../types';
import { SettingForm } from './form';

export const metadata: Metadata = {
  title: 'イベントログ',
};

export default async function Page({ params }: SettingPageProps) {
  const { guildId } = await params;
  if (!(await hasAccessDashboardPermission(guildId))) redirect('/');

  const [channels, setting] = await Promise.all([
    getChannels(guildId),
    EventLogModel.findOne({ guildId }),
  ]);

  return (
    <>
      <Header
        title='イベントログ'
        description='サーバー内で起こった特定イベントのログを送信します。'
      />
      <SettingForm
        channels={channels}
        setting={EventLogZodSchema.safeParse(setting).data ?? null}
      />
    </>
  );
}
