'use client';

import { CheckSessionProvider } from '@/components/providers/check-session';
import { ConsoleWarningProvider } from '@/components/providers/console-warn';
import { RouteProvider } from '@/components/providers/nprogress';
import { NextUIProvider } from '@nextui-org/react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <RouteProvider>
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
    </RouteProvider>
  );
}
