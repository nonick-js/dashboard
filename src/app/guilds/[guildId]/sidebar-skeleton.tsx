import { Logo } from '@/components/logo';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import { Skeleton } from '@heroui/skeleton';
import { Spacer } from '@heroui/spacer';
import { card, cn, listbox, listboxSection } from '@heroui/theme';
import type { ReactNode } from 'react';

export function SidebarSkeleton() {
  return (
    <div
      className={cn(
        card().base(),
        'hidden sm:flex sticky top-0 overflow-x-hidden rounded-none flex-row',
      )}
    >
      <div className='w-[300px] h-dvh p-6 pt-0'>
        <div className='h-[80px] flex shrink-0 items-center px-1'>
          <Link href='/'>
            <Logo height={16} />
          </Link>
        </div>

        <Button
          className='w-full flex flex-shrink-0 h-14 font-semibold justify-between'
          variant='bordered'
          isDisabled
        >
          <div className='flex items-center gap-2 overflow-hidden'>
            <Skeleton className='flex-shrink-0 w-8 h-8 rounded-full' />
            <Skeleton className='w-36 h-4 rounded-md' />
          </div>
        </Button>

        <Spacer y={3} />

        <ListboxSkeleton>
          <ListboxSectionSkeleton>
            {Array.from({ length: 2 }).map((_, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <ListboxItemSkeleton key={index} />
            ))}
          </ListboxSectionSkeleton>
          <ListboxSectionSkeleton>
            {Array.from({ length: 8 }).map((_, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <ListboxItemSkeleton key={index} />
            ))}
          </ListboxSectionSkeleton>
        </ListboxSkeleton>
      </div>
    </div>
  );
}

function ListboxSkeleton({ children }: { children: ReactNode }) {
  const listboxClasses = listbox();

  return (
    <div className={listboxClasses.base()}>
      <nav className={listboxClasses.list()}>{children}</nav>
    </div>
  );
}

function ListboxSectionSkeleton({ children }: { children: ReactNode }) {
  const listboxSectionClasses = listboxSection();

  return (
    <li className={listboxSectionClasses.base({ className: 'w-full list-none' })}>
      <Skeleton className='ml-1 mt-2 h-4 w-12 rounded-small' />
      <ul className={listboxSectionClasses.group({ className: 'space-y-0.5 pt-1' })}>{children}</ul>
    </li>
  );
}

function ListboxItemSkeleton() {
  return (
    <div className='flex items-center gap-2 px-3 py-1.5 h-[44px]'>
      <Skeleton className='w-6 h-6 rounded-small' />
      <Skeleton className='flex-1 w-full h-4 rounded-md' />
    </div>
  );
}
