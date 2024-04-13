import { getMutualGuilds } from '../mutualGuilds';
import { GuildList } from './guild-list';

export default async function Home() {
  const guilds = await getMutualGuilds();
  return <GuildList guilds={guilds} />;
}
