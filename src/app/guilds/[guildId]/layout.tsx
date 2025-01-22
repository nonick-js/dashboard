import { getGuild } from '@/lib/discord';
import type { ReactNode } from 'react';
import { Navbar } from './navbar';
import { Sidebar } from './sidebar';
import { SidebarProvider } from './sidebar-provider';

export default async function Layout({
  children,
  params,
}: { children: ReactNode; params: Promise<{ guildId: string }> }) {
  const { guildId } = await params;
  const guild = await getGuild(guildId);

  return (
    <SidebarProvider>
      <div className='flex'>
        <Sidebar guild={guild} />
        <div className='flex-1 flex-col'>
          <Navbar />
          <main className='p-6 pt-0'>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
