'use client';

import { Icon } from '@/components/iconify-icon';
import { Button } from '@nextui-org/button';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export function LoginButton() {
  const [isPressed, setIsPressed] = useState(false);
  const searchParams = useSearchParams();

  return (
    <Button
      onPress={() => {
        signIn('discord', { redirectTo: searchParams.get('callbackUrl') || '/' });
        setIsPressed(true);
      }}
      color='primary'
      startContent={!isPressed && <Icon icon='ic:baseline-discord' className='text-2xl' />}
      isLoading={isPressed}
      fullWidth
      disableRipple
    >
      Discordでログイン
    </Button>
  );
}
