'use client';

import { type ReactNode, useEffect } from 'react';

export function ConsoleWarningProvider({ children }: { children: ReactNode }) {
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

  return <>{children}</>;
}
