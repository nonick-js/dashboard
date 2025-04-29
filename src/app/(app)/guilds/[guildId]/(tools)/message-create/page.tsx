import { Header } from '@/components/header';
import { getChannels } from '@/lib/discord/api';
import { requireDashboardAccessPermission } from '@/lib/permission';
import type { Metadata } from 'next';
import type { SettingPageProps } from '../../types';
import { MessageCreateForm } from './form';

export const metadata: Metadata = {
  title: 'メッセージ作成',
};

export default async function Page({ params }: SettingPageProps) {
  const { guildId } = await params;
  await requireDashboardAccessPermission(guildId);

  const channels = await getChannels(guildId);

  return (
    <>
      <Header
        title='メッセージ作成'
        description='NoNICK.jsを使用してチャンネルにメッセージを送信します。'
      />
      <MessageCreateForm channels={channels} />
    </>
  );
}
