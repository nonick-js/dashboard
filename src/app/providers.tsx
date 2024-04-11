'use client';

import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider } from 'next-themes';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <ThemeProvider attribute='class' defaultTheme='dark'>
        {children}
      </ThemeProvider>
    </NextUIProvider>
  );
}
