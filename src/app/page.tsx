'use client';

import { authClient } from '@/lib/auth-client';
import { Button } from '@heroui/button';
import { Link } from '@heroui/react';

export default function Home() {
  const { data: session } = authClient.useSession();

  return (
    <div className='flex flex-col gap-6'>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <div>
        {!session ? (
          <Button as={Link} href='/login' color='primary'>
            ログイン
          </Button>
        ) : (
          <Button onPress={() => authClient.signOut()} color='danger'>
            ログアウト
          </Button>
        )}
      </div>
    </div>
  );
}
