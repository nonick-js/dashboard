﻿import { UserDropdown } from '@/components/dashboard/user-dropdown';
import { Logo } from '@/components/logo';
import { Chip } from '@nextui-org/chip';
import { Link } from '@nextui-org/link';
import { NavbarBrand, NavbarContent, NavbarItem, Navbar as NextUINavbar } from '@nextui-org/navbar';

export function Navbar() {
  return (
    <NextUINavbar height={80} maxWidth='xl' position='static'>
      <NavbarBrand className='gap-4'>
        <Link href='/'>
          <Logo height={18} />
        </Link>
        <Chip className='max-sm:hidden' size='sm' radius='sm' variant='flat'>
          Dashboard
        </Chip>
      </NavbarBrand>
      <NavbarContent justify='end'>
        <NavbarItem>
          <UserDropdown />
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
}