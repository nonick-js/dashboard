import { ScrollArea } from '@/components/ui/scroll-area';
import type { ReactNode } from 'react';
import { NavBar } from '../../navbar';
import { Sidebar } from './sidebar';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavBar />
      <div className='max-sm:px-0 container justify-center flex h-[calc(100dvh_-_80px)]'>
        <Sidebar />
        <ScrollArea className='flex-1'>
          <div className='flex flex-col gap-4 max-sm:px-8 sm:px-4'>
            {children}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
