'use client';

import { ValidateSessionProvider } from '@/components/validate-session';
import { HeroUIProvider } from '@heroui/react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

export function Provider({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <ValidateSessionProvider>
        <ThemeProvider attribute='class' defaultTheme='dark'>
          <HeroUIProvider navigate={router.push}>{children}</HeroUIProvider>
        </ThemeProvider>
      </ValidateSessionProvider>
    </SessionProvider>
  );
}
