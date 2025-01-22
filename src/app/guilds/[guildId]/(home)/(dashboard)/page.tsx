import { Header, HeaderTitle } from '@/components/header';
import { hasAccessDashboardPermission } from '@/lib/discord';
import { Alert } from '@heroui/alert';
import { Code } from '@heroui/code';
import { redirect } from 'next/navigation';
import React from 'react';
import type { SettingPageProps } from '../../types';
import { GuildStatsCard } from './guild-stats-card';

export default async function Page({ params }: SettingPageProps) {
  const { guildId } = await params;
  if (!(await hasAccessDashboardPermission(guildId))) redirect('/');

  return (
    <>
      <GuildStatsCard guildId={guildId} />
      <Alert
        variant='faded'
        color='primary'
        title={
          <span>
            <Code>v5.2</Code>{' '}
            から、メンバー数やメッセージ数の増減をこのページで確認できるようになります。
          </span>
        }
      />
    </>
  );
}
