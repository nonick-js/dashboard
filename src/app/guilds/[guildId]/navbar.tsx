'use client';

import { UserDropdown } from '@/components/dashboard/user-dropdown';
import { Icon } from '@/components/icon';
import { Logo } from '@/components/logo';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import { Navbar as HeroUINavbar, NavbarContent, NavbarItem } from '@heroui/navbar';
import { useContext } from 'react';
import { SidebarContext } from './sidebar-provider';

export function Navbar() {
  const { onOpen } = useContext(SidebarContext);

  return (
    <HeroUINavbar height={80} maxWidth='full'>
      <NavbarContent justify='start'>
        <NavbarItem className='sm:hidden'>
          <Button isIconOnly size='sm' variant='light' onPress={onOpen}>
            <Icon
              className='text-default-500'
              height={24}
              icon='solar:hamburger-menu-outline'
              width={24}
            />
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify='center'>
        <NavbarItem className='sm:hidden'>
          <Link href='/'>
            <Logo height={16} />
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify='end'>
        <NavbarItem>
          <UserDropdown />
        </NavbarItem>
      </NavbarContent>
    </HeroUINavbar>
  );
}
