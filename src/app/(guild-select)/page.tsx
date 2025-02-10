import { Header } from '@/components/header';
import { Suspense } from 'react';
import { GuildContainer, GuildContainerSkeleton } from './guild-container';
import { InviteButton } from './invite-button';

export default function Home() {
  return (
    <main className='container max-w-screen-xl'>
      <header className='mt-3 mb-8 flex w-full flex-col sm:flex-row gap-6 items-start sm:items-center justify-between'>
        <Header
          className='flex-1'
          title='サーバー選択'
          description='Botの設定を行うサーバーを選択してください。'
          descriptionClass='text-medium'
        />
        <InviteButton className='max-sm:w-full' />
      </header>
      <Suspense key={Math.random()} fallback={<GuildContainerSkeleton />}>
        <GuildContainer />
      </Suspense>
    </main>
  );
}
