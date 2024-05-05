import { Header } from '@/components/header';
import { AutoPublicConfig } from '@/database/models';
import { AutoPublicConfig as AutoPublicConfigSchema } from '@/database/zod/config';
import { getChannels } from '@/lib/discord';
import { dbConnect } from '@/lib/mongoose';
import { convertPlainObject } from '@/lib/utils';
import type { Metadata } from 'next';
import Form from './form';

export const metadata: Metadata = {
  title: '自動アナウンス公開',
};

export default async function Page({ params: { guildId } }: { params: { guildId: string } }) {
  await dbConnect();
  const config = await AutoPublicConfig.findOne({ guildId });
  const channels = await getChannels(guildId);

  return (
    <>
      <Header
        title='自動アナウンス公開'
        description='アナウンスチャンネルに投稿されたメッセージを自動で公開します。'
      />
      <Form
        channels={channels}
        config={config ? convertPlainObject(AutoPublicConfigSchema.parse(config)) : null}
      />
    </>
  );
}
