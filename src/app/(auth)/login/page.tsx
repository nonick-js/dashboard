import Logo from '@/components/logo';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Link } from '@nextui-org/link';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { UserAuthForm } from './form';

export const metadata: Metadata = {
  title: 'ログイン',
};

export default function Page() {
  return (
    <div className='container flex h-dvh items-center justify-center'>
      <Card className='w-[400px] space-y-6'>
        <CardHeader className='flex flex-col items-start gap-6 p-6 pb-0'>
          <Logo className='pt-3' width={140} />
          <section>
            <h1 className='text-xl font-medium'>ログインが必要です</h1>
            <p className='text-sm text-foreground-500'>
              Discordアカウントを使用して続行
            </p>
          </section>
        </CardHeader>
        <CardBody className='flex flex-col gap-6 p-6 pt-0'>
          <Suspense>
            <UserAuthForm />
          </Suspense>
          <p className='text-sm text-foreground-500'>
            ログインすることで、NoNICK.jsの
            <Link
              className='text-sm'
              href='https://docs.nonick-js.com/important/teams-of-service/'
              isExternal
              showAnchorIcon
            >
              利用規約
            </Link>
            および
            <Link
              className='text-sm'
              href='https://docs.nonick-js.com/important/privacy-policy/'
              isExternal
              showAnchorIcon
            >
              プライバシーポリシー
            </Link>
            に同意したとみなされます。
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
