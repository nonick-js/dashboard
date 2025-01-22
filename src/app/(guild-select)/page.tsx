import { Header, HeaderDescription, HeaderTitle } from '@/components/header';
import { Suspense } from 'react';
import { GuildContainer, GuildContainerSkeleton } from './guild-container';
import { InviteButton } from './invite-button';

export default function Home() {
  return (
    <main className='container max-w-screen-xl'>
      <header className='mt-3 mb-8 flex w-full flex-col sm:flex-row gap-6 items-start sm:items-center justify-between'>
        <Header>
          <HeaderTitle>サーバー選択</HeaderTitle>
          <HeaderDescription className='text-medium'>
            Botの設定を行うサーバーを選択してください。
          </HeaderDescription>
        </Header>
        <InviteButton className='max-sm:w-full' />
      </header>
      <Suspense key={Math.random()} fallback={<GuildContainerSkeleton />}>
        <GuildContainer />
      </Suspense>
    </main>
  );
}
