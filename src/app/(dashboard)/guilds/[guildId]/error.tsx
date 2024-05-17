'use client';

import { Alert } from '@/components/ui/alert';
import { useEffect } from 'react';

export default function ErrorPage({ error }: { error: Error }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Alert
      title='問題が発生しました'
      description='ページの読み込み中に予期しないエラーが発生しました。時間を置いて再度アクセスしてください。'
      variant='danger'
    />
  );
}
