'use client';

import { CheckSessionProvider } from '@/components/providers/check-session';
import { ConsoleWarningProvider } from '@/components/providers/console-warn';
import { usePRouter } from '@/hooks/use-prouter';
import { NextUIProvider } from '@nextui-org/react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { type ReactNode, Suspense } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const router = usePRouter();

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
