import type { ReactNode } from 'react';
import { NavBar } from './navbar';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavBar />
      <div className='container mt-3'>
        <section className='flex flex-col gap-1'>
          <h1 className='text-3xl sm:text-4xl font-black'>サーバー選択</h1>
          <p className='text-default-500'>
            <span className='inline-block'>NoNICK.jsの設定を行いたいサーバーを</span>
            <span className='inline-block'>選択してください。</span>
          </p>
        </section>
        {children}
      </div>
    </>
  );
}
