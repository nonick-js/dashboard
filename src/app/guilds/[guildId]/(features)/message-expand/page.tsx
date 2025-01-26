import { Header } from '@/components/header';
import { MessageExpandModel } from '@/lib/database/mongoose';
import { MessageExpandZodSchema } from '@/lib/database/zod';
import { getChannels, hasAccessDashboardPermission } from '@/lib/discord';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import type { SettingPageProps } from '../../types';
import { SettingForm } from './form';

export const metadata: Metadata = {
  title: 'メッセージURL展開',
};

export default async function Page({ params }: SettingPageProps) {
  const { guildId } = await params;
  if (!(await hasAccessDashboardPermission(guildId))) redirect('/');

  const [channels, setting] = await Promise.all([
    getChannels(guildId),
    MessageExpandModel.findOne({ guildId }),
  ]);

  return (
    <>
      <Header
        title='メッセージURL展開'
        description='DiscordのメッセージURLが送信された際に、そのメッセージの内容を追加で送信します。'
      />
      <SettingForm
        channels={channels}
        config={MessageExpandZodSchema.safeParse(setting).data ?? null}
      />
    </>
  );
}
