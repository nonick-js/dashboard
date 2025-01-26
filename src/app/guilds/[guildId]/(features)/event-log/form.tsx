'use client';

import { FormCard } from '@/components/form';
import { FormChangePublisher } from '@/components/react-hook-form/change-publisher';
import { ChannelSelect } from '@/components/react-hook-form/channel-select';
import { ControlledForm } from '@/components/react-hook-form/form';
import { ControlledSwitch } from '@/components/react-hook-form/switch';
import { EventLogZodSchema } from '@/lib/database/zod';
import type { getChannels } from '@/lib/discord';
import { Alert } from '@heroui/alert';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChannelType } from 'discord-api-types/v10';
import { useParams } from 'next/navigation';
import { type ReactNode, createContext, useContext } from 'react';
import { type SubmitHandler, useForm, useFormContext, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import type { z } from 'zod';
import { updateSetting } from './action';

// #region Types, Context
type InputSetting = z.input<typeof EventLogZodSchema>;
type OutputSetting = z.output<typeof EventLogZodSchema>;

type Props = {
  channels: Awaited<ReturnType<typeof getChannels>>;
  setting: OutputSetting | null;
};

const PropsContext = createContext<Omit<Props, 'setting'>>({
  channels: [],
});
// #endregion

// #region Form
export function SettingForm({ setting, ...props }: Props) {
  const { guildId } = useParams<{ guildId: string }>();

  const form = useForm<InputSetting, unknown, OutputSetting>({
    resolver: zodResolver(EventLogZodSchema),
    defaultValues: setting ?? {
      timeout: { enabled: false, channel: null },
      kick: { enabled: false, channel: null },
      ban: { enabled: false, channel: null },
      voice: { enabled: false, channel: null },
      messageDelete: { enabled: false, channel: null },
      messageEdit: { enabled: false, channel: null },
    },
  });

  const onSubmit: SubmitHandler<OutputSetting> = async (values) => {
    const res = await updateSetting({ guildId, ...values });

    if (res?.data?.success) form.reset(form.getValues());
    else toast.error('設定の保存時に問題が発生しました。');
  };

  return (
    <PropsContext value={props}>
      <ControlledForm form={form} onSubmit={form.handleSubmit(onSubmit)}>
        <LogSetting
          name='timeout'
          cardTitle='タイムアウト'
          switchLabel='タイムアウトログを有効にする'
          switchDescription='メンバーをタイムアウトしたり、タイムアウトを手動で解除したりした際にログを送信します。'
        />
        <LogSetting
          name='kick'
          cardTitle='キック'
          switchLabel='キックログを有効にする'
          switchDescription='メンバーをキックした際にログを送信します。'
        />
        <LogSetting
          name='ban'
          cardTitle='BAN'
          switchLabel='BANログを有効にする'
          switchDescription='メンバーをBANしたり、BANを解除した際にログを送信します。'
        />
        <LogSetting
          name='voice'
          cardTitle='ボイスチャット'
          switchLabel='VCログを有効にする'
          switchDescription='ボイスチャットの入室や退室、移動があった際にログを送信します。'
        />
        <LogSetting
          name='messageEdit'
          cardTitle='メッセージ編集'
          switchLabel='編集ログを有効にする'
          switchDescription='メッセージが編集された際にログを送信します。'
        />
        <LogSetting
          name='messageDelete'
          cardTitle='メッセージ削除'
          switchLabel='削除ログを有効にする'
          switchDescription='メッセージが削除された際にログを送信します。'
          startContent={
            <Alert
              title='この機能は全てのメッセージの削除ログを保証するものではありません。'
              description='Discordの仕様上、一部のメッセージは削除されてもログが送信されないことがあります。'
              variant='faded'
              color='warning'
            />
          }
        />
        <FormChangePublisher />
      </ControlledForm>
    </PropsContext>
  );
}
// #endregion

// #region Component
type LogSettingProps = {
  name: keyof Omit<InputSetting, 'guildId'>;
  cardTitle: string;
  switchLabel: ReactNode;
  switchDescription: ReactNode;
  startContent?: ReactNode;
};

function LogSetting({
  name,
  cardTitle,
  switchLabel,
  switchDescription,
  startContent,
}: LogSettingProps) {
  const { channels } = useContext(PropsContext);
  const { control } = useFormContext<InputSetting>();

  const isLogEnabled = useWatch<InputSetting>({ name: `${name}.enabled` });

  return (
    <FormCard title={cardTitle}>
      {startContent}
      <ControlledSwitch
        control={control}
        name={`${name}.enabled`}
        label={switchLabel}
        description={switchDescription}
      />
      <ChannelSelect
        control={control}
        name={`${name}.channel`}
        channels={channels}
        channelTypeFilter={{ include: [ChannelType.GuildText] }}
        label='ログを送信するチャンネル'
        isRequired
        isDisabled={!isLogEnabled}
      />
    </FormCard>
  );
}
// #endregion
