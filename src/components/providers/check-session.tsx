'use client';

import { signOut, useSession } from 'next-auth/react';
import type { ReactNode } from 'react';

export function CheckSessionProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  if (session?.error === 'invalid_token') signOut();

  return <>{children}</>;
}
