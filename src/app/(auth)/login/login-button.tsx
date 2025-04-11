'use client';

import { Icon } from '@/components/icon';
import { Button } from '@heroui/button';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export function LoginButton() {
  const [isPressed, setIsPressed] = useState(false);
  const searchParams = useSearchParams();

  return (
    <Button
      onPress={async () => {
        setIsPressed(true);
        signIn('discord', {
          redirectTo: searchParams.get('callbackUrl') || '/',
        });
      }}
      color='primary'
      startContent={!isPressed && <Icon icon='ic:baseline-discord' width={24} height={24} />}
      isLoading={isPressed}
      fullWidth
      disableRipple
    >
      Discordでログイン
    </Button>
  );
}
