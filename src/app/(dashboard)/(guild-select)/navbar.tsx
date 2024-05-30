import Logo from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserDropdown } from '@/components/user-dropdown';
import { Chip } from '@nextui-org/chip';
import Link from 'next/link';

export function NavBar() {
  return (
    <div className='container flex h-20 items-center justify-between gap-4 sm:gap-0'>
      <div className='flex items-center gap-3'>
        <Link href='/' aria-label='nonick.js' passHref>
          <Logo width={120} />
        </Link>
        <Chip
          size='sm'
          variant='flat'
          classNames={{
            base: 'max-sm:hidden px-2',
            content: 'font-semibold',
          }}
        >
          Dashboard
        </Chip>
      </div>
      <div className='flex gap-2 items-center'>
        <ThemeToggle />
        <UserDropdown />
      </div>
    </div>
  );
}
