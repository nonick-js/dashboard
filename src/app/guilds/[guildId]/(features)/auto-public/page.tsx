import { Header } from '@/components/header';
import { AutoPublicModel } from '@/lib/database/mongoose';
import { AutoPublicZodSchema } from '@/lib/database/zod';
import { getChannels, hasAccessDashboardPermission } from '@/lib/discord';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import type { SettingPageProps } from '../../types';
import { SettingForm } from './form';

export const metadata: Metadata = {
  title: '自動アナウンス公開',
};

export default async function Page({ params }: SettingPageProps) {
  const { guildId } = await params;
  if (!(await hasAccessDashboardPermission(guildId))) redirect('/');

  const [channels, setting] = await Promise.all([
    getChannels(guildId),
    AutoPublicModel.findOne({ guildId }),
  ]);

  return (
    <>
      <Header
        title='自動アナウンス公開'
        description='アナウンスチャンネルに投稿されたメッセージを自動で公開します。'
      />
      <SettingForm
        channels={channels}
        setting={AutoPublicZodSchema.safeParse(setting).data ?? null}
      />
    </>
  );
}
