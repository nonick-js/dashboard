import { getGuild } from '@/lib/discord';
import { type ReactNode, Suspense } from 'react';
import { Navbar } from './navbar';
import { Sidebar } from './sidebar';
import { SidebarProvider } from './sidebar-provider';
import { SidebarSkeleton } from './sidebar-skeleton';

export default async function Layout({
  children,
  params,
}: { children: ReactNode; params: Promise<{ guildId: string }> }) {
  const { guildId } = await params;

  return (
    <SidebarProvider>
      <div className='flex'>
        <Suspense fallback={<SidebarSkeleton />}>
          <FetchSidebar guildId={guildId} />
        </Suspense>
        <div className='flex-1 flex-col'>
          <Navbar />
          <main className='p-6 pt-0'>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

async function FetchSidebar({ guildId }: { guildId: string }) {
  const guild = await getGuild(guildId);

  return <Sidebar guild={guild} />;
}
