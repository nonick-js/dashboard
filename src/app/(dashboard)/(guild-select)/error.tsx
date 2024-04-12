'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Icon } from '@iconify-icon/react';
import { useEffect } from 'react';
import { ToolbarMockup } from './toolbar-mockup';

export default function ErrorPage({ error }: { error: Error }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='py-6 flex flex-col gap-6'>
      <ToolbarMockup />
      <div className='flex justify-center'>
        <Alert variant='destructive'>
          <Icon icon='solar:danger-circle-bold' className='text-[20px]' />
          <div className='flex-1'>
            <AlertTitle>問題が発生しました</AlertTitle>
            <AlertDescription>
              ページの読み込み中に予期しないエラーが発生しました。時間を置いて再度アクセスしてください。
            </AlertDescription>
          </div>
        </Alert>
      </div>
    </div>
  );
}
