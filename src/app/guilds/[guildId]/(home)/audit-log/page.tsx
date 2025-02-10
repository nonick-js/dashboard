import { Header } from '@/components/header';
import { hasAccessDashboardPermission } from '@/lib/discord';
import { Alert } from '@heroui/alert';
import { Code } from '@heroui/code';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React from 'react';
import type { SettingPageProps } from '../../types';

export const metadata: Metadata = {
  title: '監査ログ',
};

export default async function Page({ params }: SettingPageProps) {
  const { guildId } = await params;
  if (!(await hasAccessDashboardPermission(guildId))) redirect('/');

  return (
    <>
      <Header
        title='監査ログ'
        description='ユーザーがダッシュボードで加えた変更を閲覧することができます。'
      />
      <Alert
        color='primary'
        variant='faded'
        title={
          <span>
            この機能は <Code>v5.1</Code> から使用できるようになります。
          </span>
        }
      />
    </>
  );
}
