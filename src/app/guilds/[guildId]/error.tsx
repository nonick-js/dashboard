'use client';

import { Icon } from '@/components/icon';
import { Alert } from '@heroui/alert';
import { Button } from '@heroui/button';
import { useEffect } from 'react';

export default function ErrorPage({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Alert
      color='danger'
      variant='faded'
      title='問題が発生しました'
      description='ページの読み込み中に予期しないエラーが発生しました。時間をおいて再読み込みしてください。'
    />
  );
}
