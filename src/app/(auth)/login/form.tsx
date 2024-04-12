'use client';

import { SiDiscord } from '@icons-pack/react-simple-icons';
import { Button } from '@nextui-org/button';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export function UserAuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  return (
    <div className='flex flex-col gap-3'>
      <Button
        onClick={() => {
          setIsLoading(true);
          signIn('discord', {
            callbackUrl: searchParams?.get('from') || '/',
          });
        }}
        color='primary'
        startContent={!isLoading && <SiDiscord size={20} />}
        isLoading={isLoading}
        fullWidth
        disableRipple
      >
        Discordでログイン
      </Button>
      <Link href='https://docs.nonick-js.com/nonick-js/how-to-login' passHref>
        <Button variant='flat' fullWidth disableRipple>
          ログインについて
        </Button>
      </Link>
    </div>
  );
}
