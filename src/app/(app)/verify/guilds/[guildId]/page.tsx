import { getGuild, isUserJoinedGuild } from '@/lib/discord/api';
import { db } from '@/lib/drizzle';
import { forbidden, notFound } from 'next/navigation';
import MultiStepVerificationCard from './multistep-form-card';

export default async function Page({
  params,
}: {
  params: Promise<{
    guildId: string;
  }>;
}) {
  const { guildId } = await params;

  const guild = await getGuild(guildId).catch(() => null);
  if (!guild) notFound();

  const setting = await db.query.verificationSetting.findFirst({
    where: (setting, { eq }) => eq(setting.guildId, guild.id),
  });

  if (!setting?.enabled || !setting.role || setting.captchaType !== 'web') notFound();
  if (!(await isUserJoinedGuild(guild.id))) forbidden();

  return <MultiStepVerificationCard guild={guild} />;
}
