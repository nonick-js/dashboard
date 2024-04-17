import { ScrollShadow } from '@nextui-org/scroll-shadow';
import type { ReactNode } from 'react';
import { NavBar } from '../../navbar';
import { Sidebar } from './sidebar';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavBar />
      <div className='max-sm:px-0 container justify-center flex h-[calc(100dvh_-_80px)]'>
        <Sidebar />
        <ScrollShadow className='flex-1' hideScrollBar>
          <div className='flex flex-col gap-6 px-8'>{children}</div>
        </ScrollShadow>
      </div>
    </>
  );
}
