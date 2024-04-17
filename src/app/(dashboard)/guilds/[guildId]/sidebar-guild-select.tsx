'use client';

import { Discord } from '@/lib/constants';
import { Avatar } from '@nextui-org/react';
import { Select, SelectItem, type SelectedItems } from '@nextui-org/select';
import type { RESTAPIPartialCurrentUserGuild } from 'discord-api-types/v10';
import { useRouter } from 'next-nprogress-bar';
import { useParams } from 'next/navigation';

type Props = {
  mutualGuilds: RESTAPIPartialCurrentUserGuild[];
};

export function SidebarGuildSelect({ mutualGuilds }: Props) {
  const router = useRouter();
  const guildId = useParams().guildId as string;

  function renderValue(items: SelectedItems<RESTAPIPartialCurrentUserGuild>) {
    return (
      <div className='flex flex-wrap items-center'>
        {items.map((item) => (
          <SingleSelectItem guild={item.data} key={item.key} />
        ))}
      </div>
    );
  }

  return (
    <Select
      classNames={{ trigger: 'h-14' }}
      onChange={(e) => router.push(`/guilds/${e.target.value}`)}
      defaultSelectedKeys={[guildId]}
      items={mutualGuilds}
      size='md'
      variant='bordered'
      aria-label='サーバー選択'
      renderValue={renderValue}
      disallowEmptySelection
    >
      {(guild) => (
        <SelectItem key={guild.id} value={guild.id} textValue={guild.name}>
          <SingleSelectItem guild={guild} />
        </SelectItem>
      )}
    </Select>
  );
}

function SingleSelectItem({
  guild,
}: { guild?: RESTAPIPartialCurrentUserGuild | null }) {
  return (
    <div className='flex items-center gap-3 text-foreground'>
      <Avatar
        src={
          guild?.icon
            ? `${Discord.Endpoints.CDN}/icons/${guild.id}/${guild.icon}.webp`
            : `${Discord.Endpoints.CDN}/embed/avatars/0.png`
        }
        size='sm'
        aria-label='サーバーアイコン'
      />
      <span className='font-semibold'>{guild?.name}</span>
    </div>
  );
}
