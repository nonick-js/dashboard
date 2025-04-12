import { auth } from '@/lib/auth';
import { getMutualManagedGuilds } from '@/lib/discord/api';
import type { Metadata } from 'next';
import { GuildCardContainer } from './guild-container';
import { SessionAlert } from './session-alert';

export const metadata: Metadata = {
  title: 'サーバー選択',
};

export default async function Page() {
  const session = await auth();

  if (session?.error) {
    return <SessionAlert />;
  }

  const mutualGuilds = await getMutualManagedGuilds();
  if (mutualGuilds.error) throw new Error(mutualGuilds.error.statusText);

  return <GuildCardContainer guilds={mutualGuilds.data} />;
}
