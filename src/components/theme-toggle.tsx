'use client';

import { Icon } from '@iconify-icon/react';
import { Button, type ButtonProps } from '@nextui-org/react';
import { useTheme } from 'next-themes';

export function ThemeToggle(props: ButtonProps) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      isIconOnly
      variant='light'
      disableRipple
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      {...props}
    >
      <Icon
        icon='solar:sun-bold'
        className='text-[20px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0'
      />
      <Icon
        icon='solar:moon-bold'
        className='text-[20px] absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100'
      />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
