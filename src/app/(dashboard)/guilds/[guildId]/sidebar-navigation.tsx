'use client';

import dashboardConfig from '@/config/dashboard';
import { Icon } from '@iconify-icon/react';
import { Chip, cn } from '@nextui-org/react';
import Link from 'next/link';
import { useParams, useSelectedLayoutSegments } from 'next/navigation';

export function SidebarNavigation() {
  const guildId = useParams().guildId as string;
  const segment = useSelectedLayoutSegments().find(
    (seg) => !/^\(.*\)$/.test(seg), // route groupsのパスを無視する
  );

  return (
    <div className='flex flex-col'>
      {dashboardConfig.sidebar.map(({ label, items }, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <ul key={index} className='flex flex-col gap-1'>
          {label && (
            <li>
              <p className='py-[9px] font-extrabold'>{label}</p>
            </li>
          )}
          {items.map(({ href, label, badge, icon }, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <li key={index}>
              <Link
                href={`/guilds/${guildId}${href}`}
                className={cn(
                  'flex w-full items-center justify-between rounded-md',
                  'px-3 py-[9px] text-sm transition ease-in-out hover:bg-zinc-400/15',
                  { 'bg-zinc-400/20': `/${segment || ''}` === href },
                )}
              >
                <div className='flex items-center gap-3'>
                  <Icon icon={icon} className='text-[20px]' />
                  <span>{label}</span>
                </div>
                {badge && (
                  <Chip size='sm' classNames={{ base: 'h-auto py-0.5' }}>
                    {badge}
                  </Chip>
                )}
              </Link>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}
