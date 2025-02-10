'use client';

import { FormCard } from '@/components/form';
import { FormChangePublisher } from '@/components/react-hook-form/change-publisher';
import { ChannelSelect } from '@/components/react-hook-form/channel-select';
import { RoleSelect } from '@/components/react-hook-form/role-select';
import { ControlledForm } from '@/components/react-hook-form/ui/form';
import { ControlledSwitch } from '@/components/react-hook-form/ui/switch';
import { ReportZodSchema } from '@/lib/database/zod';
import type { getChannels, getRoles } from '@/lib/discord';
import { Alert } from '@heroui/alert';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChannelType } from 'discord-api-types/v10';
import { useParams } from 'next/navigation';
import { createContext, useContext } from 'react';
import { type SubmitHandler, useForm, useFormContext, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import type { z } from 'zod';
import { updateSetting } from './action';

// #region Types, Context
type InputSetting = z.input<typeof ReportZodSchema>;
type OutputSetting = z.output<typeof ReportZodSchema>;

type Props = {
  channels: Awaited<ReturnType<typeof getChannels>>;
  roles: Awaited<ReturnType<typeof getRoles>>;
  setting: OutputSetting | null;
};

const PropsContext = createContext<Omit<Props, 'setting'>>({
  channels: [],
  roles: [],
});
// #endregion

// #region Form
export function SettingForm({ setting, ...props }: Props) {
  const { guildId } = useParams<{ guildId: string }>();

  const form = useForm<InputSetting, unknown, OutputSetting>({
    resolver: zodResolver(ReportZodSchema),
    defaultValues: setting ?? {
      channel: '',
      includeModerator: false,
      progressButton: true,
      mention: {
        enabled: false,
        roles: [],
      },
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
        <Alert
          variant='faded'
          color='primary'
          description='この機能を無効にするには、Discordサーバーの「サーバー設定」→「連携サービス」から、コマンドを無効化する必要があります。'
        />
        <EnableSetting />
        <GeneralSetting />
        <NotificationSetting />
        <FormChangePublisher />
      </ControlledForm>
    </PropsContext>
  );
}

function EnableSetting() {
  const { channels } = useContext(PropsContext);
  const { control } = useFormContext<InputSetting>();

  return (
    <FormCard>
      <ChannelSelect
        control={control}
        name='channel'
        channels={channels}
        channelTypeFilter={{ include: [ChannelType.GuildText] }}
        label='通報を表示するチャンネル'
        disallowEmptySelection
        isRequired
      />
    </FormCard>
  );
}

function GeneralSetting() {
  const { control } = useFormContext<InputSetting>();

  return (
    <FormCard title='基本設定'>
      <ControlledSwitch
        control={control}
        name='includeModerator'
        label='モデレーターも通報の対象にする'
        description='有効にすると、「メンバー管理」権限を持つユーザーをメンバーが通報できるようになります。'
      />
      <ControlledSwitch
        control={control}
        name='progressButton'
        label='進捗ボタンを表示する'
        description='送られた通報に「対処済み」「無視」などの、通報のステータスを管理できるボタンを表示します。'
      />
    </FormCard>
  );
}

function NotificationSetting() {
  const { roles } = useContext(PropsContext);
  const { control } = useFormContext<InputSetting>();

  const isMentionEnabled = useWatch<InputSetting>({ name: 'mention.enabled' });

  return (
    <FormCard title='通知設定'>
      <ControlledSwitch
        control={control}
        name='mention.enabled'
        label='メンション通知を有効にする'
        description='通報が送られた際に特定のロールをメンションします。'
      />
      <RoleSelect
        control={control}
        name='mention.roles'
        roles={roles}
        label='メンションするロール'
        selectionMode='multiple'
        isRequired
        isDisabled={!isMentionEnabled}
      />
    </FormCard>
  );
}
// #endregion
