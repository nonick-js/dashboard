'use client';

import { CheckSessionProvider } from '@/components/check-session';
import { ReactScan } from '@/components/react-scan';
import { HeroUIProvider } from '@heroui/react';
import { SessionProvider, signOut, useSession } from 'next-auth/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useRouter } from 'next/navigation';
import { type ReactNode, useEffect } from 'react';

export function Provider({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    console.log('%cストップ！', 'font-size: 4rem; color: red');
    console.log(
      '%cここに何かを貼り付けると、あなたのアカウントが危険にさらされる可能性があります!',
      'font-size: 1rem; color: orange',
    );
    console.log(
      '%c自分が何をしようとしているか理解していないのなら、何も入力せずウィンドウを閉じるべきです。',
      'font-size: 1rem',
    );
  }, []);

  return (
    <SessionProvider>
      <CheckSessionProvider>
        <HeroUIProvider navigate={router.push}>
          <NextThemesProvider attribute='class' defaultTheme='dark'>
            {children}
            <ReactScan />
          </NextThemesProvider>
        </HeroUIProvider>
      </CheckSessionProvider>
    </SessionProvider>
  );
}
