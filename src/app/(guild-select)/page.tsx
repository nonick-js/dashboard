import { Suspense } from 'react';
import { GuildContainer, GuildContainerSkeleton } from './guild-container';
import { InviteButton } from './invite-button';

export default function Home() {
  return (
    <main className='container max-w-screen-xl'>
      <header className='mt-3 mb-8 flex w-full flex-col sm:flex-row gap-6 items-start sm:items-center justify-between'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-2xl sm:text-3xl font-extrabold sm:font-black'>サーバー選択</h1>
          <p className='sm:text-medium text-default-500'>
            Botの設定を行うサーバーを選択してください。
          </p>
        </div>
        <InviteButton className='max-sm:w-full' />
      </header>
      <Suspense key={Math.random()} fallback={<GuildContainerSkeleton />}>
        <GuildContainer />
      </Suspense>
    </main>
  );
}
