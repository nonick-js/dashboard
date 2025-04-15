﻿'use client';

import { Logo } from '@/components/logo';
import { SidebarDrawer } from '@/components/sidebar-drawer';
import { SidebarNavigation } from '@/components/sidebar-navigation';
import { SidebarContext } from '@/components/sidebar-provider';
import type { getGuild } from '@/lib/discord/api';
import { Link, ScrollShadow, Spacer } from '@heroui/react';
import { usePathname } from 'next/navigation';
import { Suspense, useContext } from 'react';
import { SidebarGuildButton, SidebarGuildButtonSkeleton } from './sidebar-guild-button';
import { sectionItems } from './sidebar-items';

export function Sidebar({ guildPromise }: { guildPromise: ReturnType<typeof getGuild> }) {
  const { isOpen, onOpenChange, onClose } = useContext(SidebarContext);
  const pathname = usePathname();
  const currentPath = pathname.split('/')?.[3];

  const content = (
    <div className='relative w-[300px] flex flex-1 flex-col'>
      <div className='h-[80px] flex shrink-0 items-center px-6'>
        <Link href='/' className='ml-1'>
          <Logo height={16} />
        </Link>
      </div>
      <ScrollShadow className='h-full px-6 hover-scrollbar'>
        <Suspense fallback={<SidebarGuildButtonSkeleton />}>
          <SidebarGuildButton guildPromise={guildPromise} />
        </Suspense>
        <Spacer y={3} />
        <SidebarNavigation
          defaultSelectedKey='dashboard'
          selectedKeys={[currentPath ?? 'dashboard']}
          items={sectionItems}
          onItemPress={() => onClose()}
        />
      </ScrollShadow>
    </div>
  );

  return (
    <div className='h-dvh'>
      <SidebarDrawer isOpen={isOpen} onOpenChange={onOpenChange}>
        {content}
      </SidebarDrawer>
    </div>
  );
}
