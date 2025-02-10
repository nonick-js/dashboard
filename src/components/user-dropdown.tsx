'use client';

import { Icon } from '@/components/icon';
import { Links } from '@/lib/constants';
import { Avatar } from '@heroui/avatar';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from '@heroui/dropdown';
import { Skeleton } from '@heroui/skeleton';
import { User } from '@heroui/user';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';

export function UserDropdown() {
  const { data: session } = useSession();

  if (!session) {
    return <Skeleton className='w-8 h-8 rounded-full' />;
  }

  return (
    <Dropdown placement='bottom-end'>
      <DropdownTrigger>
        <Avatar as='button' size='sm' src={`${session.user.image}?size=64`} showFallback />
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
                src: `${session.user.image}?size=64`,
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
