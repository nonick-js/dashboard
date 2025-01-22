import { Logo } from '@/components/logo';
import { UserDropdown } from '@/components/user-dropdown';
import { Chip } from '@heroui/chip';
import { Link } from '@heroui/link';
import { Navbar as HeroUINavbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/navbar';

export function Navbar() {
  return (
    <HeroUINavbar height={80} maxWidth='xl' position='static'>
      <NavbarBrand className='gap-4'>
        <Link href='/'>
          <Logo height={16} />
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
    </HeroUINavbar>
  );
}
