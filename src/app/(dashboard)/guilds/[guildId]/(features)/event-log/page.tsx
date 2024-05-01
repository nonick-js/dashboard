import { Header } from '@/components/header';
import { EventLogConfig } from '@/database/models';
import { EventLogConfig as EventLogConfigSchema } from '@/database/zod/config';
import { getChannels } from '@/lib/discord';
import { dbConnect } from '@/lib/mongoose';
import { convertPlainObject } from '@/lib/utils';
import type { Metadata } from 'next';
import Form from './form';

export const metadata: Metadata = {
  title: 'イベントログ',
};

export default async function Page({ params: { guildId } }: { params: { guildId: string } }) {
  await dbConnect();
  const config = await EventLogConfig.findOne({ guildId });
  const channels = await getChannels(guildId);

  return (
    <>
      <Header
        title='イベントログ'
        description='サーバー内で起こった特定イベントのログを送信します。'
      />
      <Form
        channels={channels}
        config={config ? convertPlainObject(EventLogConfigSchema.parse(config)) : null}
      />
    </>
  );
}
