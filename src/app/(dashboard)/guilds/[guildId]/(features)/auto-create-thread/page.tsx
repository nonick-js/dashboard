import { Header } from '@/components/header';
import { AutoCreateThreadConfig } from '@/database/models';
import { AutoCreateThreadConfig as AutoCreateThreadConfigSchema } from '@/database/zod/config';
import { getChannels } from '@/lib/discord';
import { dbConnect } from '@/lib/mongoose';
import { convertPlainObject } from '@/lib/utils';
import type { Metadata } from 'next';
import Form from './form';

export const metadata: Metadata = {
  title: '自動スレッド作成',
};

export default async function Page({ params: { guildId } }: { params: { guildId: string } }) {
  await dbConnect();
  const config = await AutoCreateThreadConfig.findOne({ guildId });
  const chanels = await getChannels(guildId);

  return (
    <>
      <Header
        title='自動スレッド作成'
        description='指定したチャンネルにメッセージが投稿された際、自動でスレッドを作成します。'
      />
      <Form
        channels={chanels}
        config={config ? convertPlainObject(AutoCreateThreadConfigSchema.parse(config)) : null}
      />
    </>
  );
}
