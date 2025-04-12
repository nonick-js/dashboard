import { Icon } from '@/components/icon';
import type { getGuild } from '@/lib/discord/api';
import { DiscordEndPoints } from '@/lib/discord/constants';
import { Avatar, Button, Link, Skeleton, Tooltip } from '@heroui/react';
import { use } from 'react';

export function SidebarGuildButton({
  guildPromise,
}: { guildPromise: ReturnType<typeof getGuild> }) {
  const { data: guild, error } = use(guildPromise);

  if (error) {
    return (
      <Tooltip content='サーバーを切り替える' placement='bottom' showArrow delay={1000}>
        <SidebarGuildButtonSkeleton />
      </Tooltip>
    );
  }

  return (
    <Tooltip content='サーバーを切り替える' placement='bottom' showArrow delay={1000}>
      <Button
        as={Link}
        href='/'
        className='flex flex-shrink-0 h-14 font-semibold justify-between'
        variant='bordered'
        endContent={
          <Icon
            icon='solar:sort-horizontal-bold'
            className='text-default-500 flex-shrink-0 text-xl'
          />
        }
      >
        <div className='flex items-center gap-2 overflow-hidden'>
          <Avatar
            className='flex-shrink-0'
            size='sm'
            name={guild.name}
            src={
              guild.icon
                ? `${DiscordEndPoints.CDN}/icons/${guild.id}/${guild.icon}.webp?size=64`
                : undefined
            }
            alt={`${guild.name}のサーバーアイコン`}
            showFallback
          />
          <p className='flex-1 truncate'>{guild.name}</p>
        </div>
      </Button>
    </Tooltip>
  );
}

export function SidebarGuildButtonSkeleton({ isDisabled }: { isDisabled?: boolean }) {
  return (
    <Button
      as={Link}
      href='/'
      className='w-full flex flex-shrink-0 h-14 font-semibold justify-between'
      variant='bordered'
      endContent={
        <Icon
          icon='solar:sort-horizontal-bold'
          className='text-default-500 flex-shrink-0 text-xl'
        />
      }
      isDisabled={isDisabled}
    >
      <div className='flex items-center gap-2 overflow-hidden'>
        <Skeleton className='flex-shrink-0 w-8 h-8 rounded-full' />
        <Skeleton className='w-36 h-4 rounded-md' />
      </div>
    </Button>
  );
}
