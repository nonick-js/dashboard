import { getGuild, hasAccessDashboardPermission } from '@/lib/discord';
import { redirect } from 'next/navigation';
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

  // 権限不足でリダイレクトする必要があった際、先にサイドバーがレンダリングされてしまうのを防ぐため、レンダリング前に権限の確認を行う。
  if (!(await hasAccessDashboardPermission(guildId))) redirect('/');

  return (
    <SidebarProvider>
      <div className='flex'>
        <Suspense fallback={<SidebarSkeleton />}>
          <FetchSidebar guildId={guildId} />
        </Suspense>
        <div className='flex-1 flex-col'>
          <Navbar />
          <main className='max-w-[1100px] mx-auto flex flex-col gap-6 px-6'>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

async function FetchSidebar({ guildId }: { guildId: string }) {
  const guild = await getGuild(guildId);

  return <Sidebar guild={guild} />;
}
