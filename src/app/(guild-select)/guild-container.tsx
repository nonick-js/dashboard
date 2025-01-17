import { auth } from '@/auth';
import { Icon } from '@/components/iconify-icon';
import { Discord } from '@/lib/constants';
import { getMutualManagedGuilds } from '@/lib/discord';
import { Alert } from '@heroui/alert';
import { Card } from '@heroui/card';
import { Link } from '@heroui/link';
import { cn } from '@heroui/theme';
import { GuildCard, GuildCardSkeleton } from './guild-card';

export async function GuildContainer() {
  try {
    const session = await auth();
    if (!session) return null;

    const guilds = await getMutualManagedGuilds(session.user.accessToken);

    if (!guilds.length) {
      return (
        <div className='grid grid-cols-12 gap-6'>
          <Card
            as={Link}
            className='col-span-12 sm:col-span-6 lg:col-span-3 h-40 flex items-center justify-center gap-4 rounded-medium border-dashed border-content3 border-2 shadow-none hover:opacity-100 active:opacity-100'
            href={`${Discord.Endpoints.OAuth2}/authorize?${new URLSearchParams({
              client_id: process.env.AUTH_DISCORD_ID,
              scope: 'bot applications.commands',
              permissions: process.env.DISCORD_INVITE_PERMISSION,
              response_type: 'code',
              redirect_uri: process.env.AUTH_URL,
            })}`}
            isPressable
          >
            <div className='w-[70px] h-[70px] bg-content2 rounded-full flex items-center justify-center'>
              <Icon icon='solar:widget-add-bold' className='text-4xl text-default-500' />
            </div>
            <p className='text-default-500'>サーバーを追加</p>
          </Card>
        </div>
      );
    }

    return (
      <div className='grid grid-cols-12 gap-6'>
        {guilds.map((guild) => (
          <GuildCard key={guild.id} guild={guild} />
        ))}
      </div>
    );
  } catch {
    return (
      <Alert
        color='danger'
        variant='faded'
        title='問題が発生しました'
        description='サーバーの読み込み中に予期しないエラーが発生しました。時間をおいて再読み込みしてください。'
      />
    );
  }
}

export function GuildContainerSkeleton() {
  return (
    <div className='grid grid-cols-12 gap-6'>
      {Array(8)
        .fill(null)
        .map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <GuildCardSkeleton className={cn({ 'max-sm:hidden': index > 1 })} key={index} />
        ))}
    </div>
  );
}
