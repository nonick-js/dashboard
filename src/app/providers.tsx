'use client';

import { CheckSessionProvider } from '@/components/providers/check-session';
import { ConsoleWarningProvider } from '@/components/providers/console-warn';
import { NextUIProvider } from '@nextui-org/react';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next-nprogress-bar';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <SessionProvider>
      <CheckSessionProvider>
        <ConsoleWarningProvider>
          <NextUIProvider navigate={router.push}>
            <ThemeProvider attribute='class' defaultTheme='dark'>
              {children}
            </ThemeProvider>
          </NextUIProvider>
        </ConsoleWarningProvider>
      </CheckSessionProvider>
    </SessionProvider>
  );
}
