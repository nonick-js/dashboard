import { SidebarProvider } from '@/components/sidebar-provider';
import { auth } from '@/lib/auth';
import { getGuild, redirectIfNoAccessPermission } from '@/lib/discord/api';
import type { ReactNode } from 'react';
import { Navbar } from './navbar';
import { Sidebar } from './sidebar';

export default async function Layout({
  children,
  params,
}: { children: ReactNode; params: Promise<{ guildId: string }> }) {
  const { guildId } = await params;
  await redirectIfNoAccessPermission(guildId);

  const guildPromise = getGuild(guildId, false);
  const sessionPromise = auth();

  return (
    <SidebarProvider>
      <div className='flex'>
        <Sidebar guildPromise={guildPromise} />
        <div className='flex-1 flex flex-col h-dvh overflow-y-scroll'>
          <Navbar sessionPromise={sessionPromise} />
          <div className='px-6 sm:px-8 flex flex-col gap-6'>{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}
