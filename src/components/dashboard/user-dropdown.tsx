﻿'use client';

import { Links } from '@/lib/constants';
import { Avatar } from '@nextui-org/avatar';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from '@nextui-org/dropdown';
import { Skeleton } from '@nextui-org/skeleton';
import { User } from '@nextui-org/user';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { Icon } from '../iconify-icon';

export function UserDropdown() {
  const { data: session } = useSession();

  if (!session) {
    return <Skeleton className='w-10 h-10 rounded-full' />;
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Avatar as='button' size='sm' src={session.user.image} showFallback />
      </DropdownTrigger>
      <DropdownMenu variant='flat'>
        <DropdownSection>
          <DropdownItem key='profile' textValue='profile' isReadOnly>
            <User
              name={session.user.name}
              className='font-normal'
              description='Discordアカウント'
              avatarProps={{
                size: 'sm',
                src: session.user.image,
              }}
            />
          </DropdownItem>
        </DropdownSection>
        <DropdownSection showDivider>
          <DropdownItem key='dashboard' href='/'>
            サーバー選択
          </DropdownItem>
          <DropdownItem
            key='docs'
            href={Links.Docs}
            endContent={
              <Icon icon='solar:arrow-right-up-linear' className='text-default-500 text-xl' />
            }
          >
            ドキュメント
          </DropdownItem>
          <DropdownItem
            key='support'
            href={Links.Discord}
            endContent={
              <Icon icon='solar:arrow-right-up-linear' className='text-default-500 text-xl' />
            }
          >
            サポートサーバー
          </DropdownItem>
          <DropdownItem
            key='homepage'
            href={Links.Homepage}
            endContent={
              <Icon icon='solar:arrow-right-up-linear' className='text-default-500 text-xl' />
            }
          >
            ホームページ
          </DropdownItem>
        </DropdownSection>
        <DropdownSection showDivider>
          <DropdownItem key='theme' isReadOnly endContent={<ThemeSelect />}>
            テーマ
          </DropdownItem>
        </DropdownSection>
        <DropdownSection>
          <DropdownItem key='logout' onPress={() => signOut()}>
            ログアウト
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}

function ThemeSelect() {
  const { theme, setTheme } = useTheme();

  return (
    <select
      className='text-tiny group-data-[hover=true]:border-default-500 border-small border-default-300
        dark:border-default-200 text-default-500 z-10 w-20 rounded-md
        bg-transparent py-0.5 outline-none'
      onChange={(e) => setTheme(e.target.value)}
      defaultValue={theme}
    >
      <option value='system'>システム</option>
      <option value='dark'>ダーク</option>
      <option value='light'>ライト</option>
    </select>
  );
}