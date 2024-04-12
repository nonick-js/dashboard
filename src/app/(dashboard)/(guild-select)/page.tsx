import { auth } from '@/auth';
import { getMutualGuilds } from '../mutualGuilds';
import { GuildList } from './guild-list';

export default async function Home() {
  const session = await auth();
  if (!session?.accessToken) return null;

  const guilds = await getMutualGuilds(session.accessToken);
  return <GuildList guilds={guilds} />;
}
