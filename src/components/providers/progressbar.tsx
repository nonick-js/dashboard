'use client';

import { AppProgressBar } from 'next-nprogress-bar';
import type { ReactNode } from 'react';

export function ProgressBar({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <AppProgressBar color='#006FEE' options={{ showSpinner: false }} />
    </>
  );
}
