import { Logo } from '@/components/logo';
import { Button } from '@nextui-org/button';
import { Card } from '@nextui-org/card';
import { Link } from '@nextui-org/link';
import type { Metadata } from 'next';
import NextLink from 'next/link';
import { LoginButton } from './login-button';

export const metadata: Metadata = {
  title: 'ログイン',
};

export default function Page() {
  return (
    <div className='container h-dvh flex items-center justify-center'>
      <Card className='max-w-[400px] flex flex-col gap-6 px-6 py-8'>
        <Logo width={110} />
        <div>
          <p className='text-xl pb-1 font-extrabold'>ログイン</p>
          <p className='text-sm text-default-500'>Discordアカウントを使用して続行</p>
        </div>
        <div className='flex flex-col gap-3'>
          <LoginButton />
          <Button
            as={NextLink}
            href='https://docs.nonick-js.com/nonick-js/how-to-login'
            variant='flat'
            fullWidth
            disableRipple
          >
            ログインについて
          </Button>
        </div>
        <p className='text-sm leading-none text-default-500'>
          ログインすることで、NoNICK.jsの
          <Link size='sm' href='https://nonick-js.com/tos' isExternal showAnchorIcon>
            利用規約
          </Link>
          および
          <Link size='sm' href='https://nonick-js.com/privacy-policy' isExternal showAnchorIcon>
            プライバシーポリシー
          </Link>
          に同意したとみなされます。
        </p>
      </Card>
    </div>
  );
}
