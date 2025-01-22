'use client';

import { Icon } from '@/components/icon';
import { Logo } from '@/components/logo';
import { Discord } from '@/lib/constants';
import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import { ScrollShadow } from '@heroui/scroll-shadow';
import { Spacer } from '@heroui/spacer';
import type { APIGuild } from 'discord-api-types/v10';
import { usePathname } from 'next/navigation';
import React, { useContext } from 'react';
import SidebarDrawer from './sidebar-drawer';
import { sectionItems } from './sidebar-items';
import { SidebarNavigation } from './sidebar-navigation';
import { SidebarContext } from './sidebar-provider';

export function Sidebar({ guild }: { guild: APIGuild }) {
  const pathname = usePathname();
  const currentPath = pathname.split('/')?.[3];
  const { isOpen, onOpenChange } = useContext(SidebarContext);

  const content = (
    <ScrollShadow hideScrollBar className='h-dvh flex w-[300px] flex-1 flex-col p-6 pt-0'>
      <div className='h-[80px] flex shrink-0 items-center px-1'>
        <Link href='/'>
          <Logo height={16} />
        </Link>
      </div>

      <Button
        as={Link}
        href='/'
        className='flex flex-shrink-0 h-14 font-semibold justify-between'
        variant='bordered'
        endContent={
          <Icon
            icon='solar:sort-horizontal-bold'
            className='flex-shrink-0'
            height={20}
            width={20}
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
                ? `${Discord.Endpoints.CDN}/icons/${guild.id}/${guild.icon}.webp`
                : undefined
            }
            alt={`${guild.name}のサーバーアイコン`}
            showFallback
          />
          <p className='flex-1 truncate'>{guild.name}</p>
        </div>
      </Button>

      <Spacer y={3} />

      <SidebarNavigation
        defaultSelectedKey='home'
        selectedKeys={[currentPath ?? 'home']}
        items={sectionItems}
      />
    </ScrollShadow>
  );

  return (
    <SidebarDrawer
      className='sticky top-0 !border-r-1 border-divider'
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      {content}
    </SidebarDrawer>
  );
}
