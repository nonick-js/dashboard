import { Header } from '@/components/header';
import { getRoles } from '@/lib/discord/api';
import { sortRoles } from '@/lib/discord/utils';
import { db } from '@/lib/drizzle';
import { requireDashboardAccessPermission } from '@/lib/permission';
import type { Metadata } from 'next';
import type { SettingPageProps } from '../../types';
import { AnimatedPage } from './animated-page';
import { verificationSettingFormSchema } from './form-schema';

export const metadata: Metadata = {
  title: 'メンバー認証',
};

export default async function ({ params }: SettingPageProps) {
  const { guildId } = await params;
  await requireDashboardAccessPermission(guildId);

  const [roles, setting] = await Promise.all([
    getRoles(guildId),
    db.query.verificationSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, guildId),
    }),
  ]);

  return (
    <>
      <Header
        title='メンバー認証'
        description='特定のCAPTCHA認証を行ったユーザーにロールを付与します。'
      />
      <AnimatedPage
        roles={sortRoles(roles)}
        setting={verificationSettingFormSchema.safeParse(setting).data ?? null}
      />
    </>
  );
}
