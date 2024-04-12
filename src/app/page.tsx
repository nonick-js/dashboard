'use client';

import { Button } from '@nextui-org/button';
import { signOut, useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className='flex flex-col gap-6'>
      <p>NoNICK.js ダッシュボード</p>
      <p>{JSON.stringify(session)}</p>
      <div>
        <Button onClick={() => signOut()} color='primary'>
          ログアウト
        </Button>
      </div>
    </div>
  );
}
