﻿'use client';

import { CheckSessionProvider } from '@/components/check-session';
import { HeroUIProvider } from '@heroui/system';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

export function Provider({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <SessionProvider>
      <CheckSessionProvider>
        <HeroUIProvider navigate={router.push}>
          <ThemeProvider attribute='class' defaultTheme='dark'>
            {children}
          </ThemeProvider>
        </HeroUIProvider>
      </CheckSessionProvider>
    </SessionProvider>
  );
}
