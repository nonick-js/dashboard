'use client';

import { Icon } from '@/components/icon';
import { authClient } from '@/lib/auth-client';
import { Button } from '@heroui/button';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export function LoginButton() {
  const [isPressed, setIsPressed] = useState(false);
  const searchParams = useSearchParams();

  return (
    <Button
      onPress={async () => {
        setIsPressed(true);
        await authClient.signIn.social({
          provider: 'discord',
          callbackURL: searchParams.get('callbackUrl') || '/',
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
