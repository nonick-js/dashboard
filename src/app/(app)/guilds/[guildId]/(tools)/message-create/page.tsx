import { Header } from '@/components/header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'メッセージ作成',
};

export default async function Page() {
  return (
    <>
      <Header
        title='メッセージ作成'
        description='NoNICK.jsを使用してチャンネルにメッセージを送信します。'
      />
    </>
  );
}
