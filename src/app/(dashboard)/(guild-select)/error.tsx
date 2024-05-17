'use client';

import { Alert } from '@/components/ui/alert';
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
        <Alert
          title='問題が発生しました'
          description='ページの読み込み中に予期しないエラーが発生しました。時間を置いて再度アクセスしてください。'
          variant='danger'
        />
      </div>
    </div>
  );
}
