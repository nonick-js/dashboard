import { Icon } from '@/components/icon';
import { Discord } from '@/lib/constants';
import { Button, type ButtonProps } from '@heroui/button';
import { Link } from '@heroui/link';

export function InviteButton({ ...props }: ButtonProps) {
  return (
    <Button
      {...props}
      as={Link}
      color='primary'
      startContent={<Icon icon='solar:widget-add-bold' className='text-xl' />}
      href={`${Discord.Endpoints.OAuth2}/authorize?${new URLSearchParams({
        client_id: process.env.AUTH_DISCORD_ID,
        scope: 'bot applications.commands',
        permissions: process.env.DISCORD_INVITE_PERMISSION,
        response_type: 'code',
        redirect_uri: process.env.AUTH_URL,
      })}`}
    >
      サーバーを追加
    </Button>
  );
}
