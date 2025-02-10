import { Header } from '@/components/header';
import { AutoChangeVerifyLevelModel } from '@/lib/database/mongoose';
import { AutoChangeVerifyLevelZodSchema } from '@/lib/database/zod';
import { getChannels, hasAccessDashboardPermission } from '@/lib/discord';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import type { SettingPageProps } from '../../types';
import { SettingForm } from './form';

export const metadata: Metadata = {
  title: '自動認証レベル変更',
};

export default async function Page({ params }: SettingPageProps) {
  const { guildId } = await params;
  if (!(await hasAccessDashboardPermission(guildId))) redirect('/');

  const [channels, config] = await Promise.all([
    getChannels(guildId),
    AutoChangeVerifyLevelModel.findOne({ guildId }),
  ]);

  return (
    <>
      <Header
        title='自動認証レベル変更'
        description='サーバーの認証レベルを特定の時間帯だけ変更します。'
      />
      <SettingForm
        channels={channels}
        setting={AutoChangeVerifyLevelZodSchema.safeParse(config).data ?? null}
      />
    </>
  );
}
