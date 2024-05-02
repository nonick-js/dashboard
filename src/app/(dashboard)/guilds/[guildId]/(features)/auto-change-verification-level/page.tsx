import { Header } from '@/components/header';
import { AutoChangeVerifyLevelConfig } from '@/database/models';
import { AutoChangeVerifyLevelConfig as AutoChangeVerifyLevelConfigSchema } from '@/database/zod/config';
import { getChannels } from '@/lib/discord';
import { dbConnect } from '@/lib/mongoose';
import { convertPlainObject } from '@/lib/utils';
import type { Metadata } from 'next';
import Form from './form';

export const metadata: Metadata = {
  title: '自動認証レベル変更',
};

export default async function Page({ params: { guildId } }: { params: { guildId: string } }) {
  await dbConnect();
  const config = await AutoChangeVerifyLevelConfig.findOne({ guildId });
  const channels = await getChannels(guildId);

  return (
    <>
      <Header
        title='自動認証レベル変更'
        description='サーバーの認証レベルを特定の時間帯だけ自動で変更します。'
      />
      <Form
        channels={channels}
        config={config ? convertPlainObject(AutoChangeVerifyLevelConfigSchema.parse(config)) : null}
      />
    </>
  );
}
