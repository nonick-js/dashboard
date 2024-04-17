import { ScrollShadow } from '@nextui-org/scroll-shadow';
import type { ReactNode } from 'react';
import { NavBar } from '../../navbar';
import { Sidebar } from './sidebar';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavBar />
      {/* 影描写のため、モバイルデバイスの場合はcontainerのPaddingではなくパネルのPaddingを使う */}
      <div className='max-lg:px-0 container justify-center flex h-[calc(100dvh_-_80px)]'>
        <Sidebar />
        <ScrollShadow className='flex-1' hideScrollBar>
          <div className='flex flex-col gap-6 px-[2rem] lg:pl-8 lg:pr-6'>{children}</div>
        </ScrollShadow>
      </div>
    </>
  );
}
