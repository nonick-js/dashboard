'use client';

import { Button } from '@nextui-org/button';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';

export default function Home() {
  const { data: session } = useSession();

  return (
    <>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <Button onPress={() => signOut()}>ログアウト</Button>
    </>
  );
}
