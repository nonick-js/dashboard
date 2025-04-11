import { signOut, useSession } from 'next-auth/react';
import { type ReactNode, useEffect } from 'react';

export function ValidateSessionProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error !== 'RefreshTokenError') return;
    signOut();
  }, [session?.error]);

  return <>{children}</>;
}
