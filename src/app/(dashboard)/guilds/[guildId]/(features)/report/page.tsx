import { Header } from '@/components/header';
import { ReportConfig } from '@/database/models';
import { ReportConfig as ReportConfigSchema } from '@/database/zod/config';
import { getChannels, getRoles } from '@/lib/discord';
import { dbConnect } from '@/lib/mongoose';
import { convertPlainObject } from '@/lib/utils';
import type { Metadata } from 'next';
import Form from './form';

export const metadata: Metadata = {
  title: 'サーバー内通報',
};

export default async function Page({ params: { guildId } }: { params: { guildId: string } }) {
  await dbConnect();
  const config = await ReportConfig.findOne({ guildId });
  const channels = await getChannels(guildId);
  const roles = await getRoles(guildId);

  return (
    <>
      <Header
        title='サーバー内通報'
        description='不適切なメッセージやユーザーをメンバーが通報できるようにします。'
      />
      <Form
        channels={channels}
        roles={roles}
        config={config ? convertPlainObject(ReportConfigSchema.parse(config)) : null}
      />
    </>
  );
}
