'use client';

import { Button } from '@nextui-org/button';
import { useTheme } from 'next-themes';

export default function Home() {
  const { theme, setTheme } = useTheme();

  return (
    <Button onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      NoNICK.js Dashboard
    </Button>
  );
}
