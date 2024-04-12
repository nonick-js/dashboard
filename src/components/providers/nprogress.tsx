'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import * as NProgress from 'nprogress';
import { type ReactNode, useEffect } from 'react';

export function RouteProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  return <>{children}</>;
}
