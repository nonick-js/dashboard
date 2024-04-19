import { Header } from '@/components/header';
import { MessageExpandConfig } from '@/database/models';
import { MessageExpandConfig as MessageExpandConfigSchema } from '@/database/zod/config';
import { getChannels } from '@/lib/discord';
import { dbConnect } from '@/lib/mongoose';
import { convertPlainObject } from '@/lib/utils';
import type { Metadata } from 'next';
import Form from './form';

export const metadata: Metadata = {
  title: 'メッセージURL展開',
};

export default async function Page({ params: { guildId } }: { params: { guildId: string } }) {
  await dbConnect();
  const config = await MessageExpandConfig.findOne({ guildId });
  const channels = await getChannels(guildId);

  return (
    <>
      <Header
        title='メッセージURL展開'
        description='送信されたDiscordのメッセージURLの内容を送信します。'
      />
      <Form
        channels={channels}
        config={config ? convertPlainObject(MessageExpandConfigSchema.parse(config)) : null}
      />
    </>
  );
}
