import { Header } from '@/components/header';
import { auth } from '@/lib/auth';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { InviteButton } from './invite-button';
import { Navbar } from './navbar';
import { SessionAlert } from './session-alert';

export const metadata: Metadata = {
  title: 'サーバー選択',
};

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();

  return (
    <>
      <Navbar />
      <div className='container max-w-screen-xl px-6'>
        <header className='mt-6 mb-8 flex w-full flex-col sm:flex-row gap-6 items-start sm:items-center justify-between'>
          <Header
            className='flex-1'
            title='サーバー選択'
            description='Botの設定を行うサーバーを選択してください。'
            descriptionClass='text-medium'
          />
          <InviteButton className='max-sm:w-full' />
        </header>
        {session?.error ? <SessionAlert /> : children}
      </div>
    </>
  );
}
