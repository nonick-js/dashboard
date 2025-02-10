import { Header } from '@/components/header';
import { AutoModModel } from '@/lib/database/mongoose';
import { AutoModZodSchema } from '@/lib/database/zod';
import { getChannels, getRoles, hasAccessDashboardPermission } from '@/lib/discord';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import type { SettingPageProps } from '../../types';
import { SettingForm } from './form';

export const metadata: Metadata = {
  title: 'AutoMod Plus',
};

export default async function Page({ params }: SettingPageProps) {
  const { guildId } = await params;
  if (!(await hasAccessDashboardPermission(guildId))) redirect('/');

  const [channels, roles, setting] = await Promise.all([
    getChannels(guildId),
    getRoles(guildId),
    AutoModModel.findOne({ guildId }),
  ]);

  return (
    <>
      <Header title='AutoMod Plus' description='特定の条件を満たすメッセージを自動で削除します。' />
      <SettingForm
        channels={channels}
        roles={roles}
        setting={AutoModZodSchema.safeParse(setting).data ?? null}
      />
    </>
  );
}
