import { DiscordEndPoints } from '@/lib/discord/constants';
import { Alert, Avatar, Button } from '@heroui/react';
import type { APIGuild } from 'discord-api-types/v10';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

export function VerifyForm({ guild, onNext }: { guild: APIGuild; onNext: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  return (
    <div className='flex flex-col gap-3'>
      <div>
        <p className='text-xl pb-1 font-extrabold'>メンバー認証</p>
        <p className='text-sm text-default-500'>Discordアカウントで認証を行います。</p>
      </div>
      <div className='flex flex-col items-center gap-3 py-6'>
        <Avatar
          src={`${DiscordEndPoints.CDN}/icons/${guild.id}/${guild.icon}.webp`}
          className='w-28 h-28'
        />
        <p className='text-lg font-semibold'>{guild.name}</p>
      </div>
      <div className='flex flex-col gap-3 w-full'>
        {session?.error && (
          <Alert
            title='セッションの有効期限が切れました'
            description='「他のアカウントに切り替える」ボタンから再度ログインを行ってください。'
            color='warning'
            variant='faded'
          />
        )}
        <Button
          onPress={onNext}
          color='primary'
          startContent={<Avatar src={session?.user.image} size='sm' isDisabled={isLoading} />}
          isDisabled={!!session?.error}
        >
          {session?.user.name} として認証する
        </Button>
        <Button
          onPress={() => {
            setIsLoading(true);
            signOut();
          }}
          isLoading={isLoading}
          disableRipple
        >
          他のアカウントに切り替える
        </Button>
      </div>
    </div>
  );
}
