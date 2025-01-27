'use client';

import { FormCard, FormSubCard } from '@/components/form';
import { FormChangePublisher } from '@/components/react-hook-form/change-publisher';
import { ChannelSelect } from '@/components/react-hook-form/channel-select';
import { ControlledForm } from '@/components/react-hook-form/form';
import { RoleSelect } from '@/components/react-hook-form/role-select';
import { ControlledSwitch } from '@/components/react-hook-form/switch';
import { ControlledArrayTextarea } from '@/components/react-hook-form/textarea';
import { AutoModZodSchema } from '@/lib/database/zod';
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
type InputSetting = z.input<typeof AutoModZodSchema>;
type OutputSetting = z.output<typeof AutoModZodSchema>;

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
    resolver: zodResolver(AutoModZodSchema),
    defaultValues: setting ?? {
      enabled: false,
      filter: {
        domain: { enabled: false, list: [] },
        token: false,
        inviteUrl: false,
      },
      ignore: { channels: [], roles: [] },
      log: { enabled: false, channel: null },
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
        <EnableSetting />
        <FilterSetting />
        <IgnoreSetting />
        <LogSetting />
        <FormChangePublisher />
      </ControlledForm>
    </PropsContext>
  );
}

function EnableSetting() {
  const { control } = useFormContext<InputSetting>();

  return (
    <FormCard>
      <ControlledSwitch control={control} name='enabled' label='AutoMod Plusを有効にする' />
    </FormCard>
  );
}

function FilterSetting() {
  const { control } = useFormContext<InputSetting>();

  const isEnabled = useWatch<InputSetting>({ name: 'enabled' });
  const isDomainFilterEnabled = useWatch<InputSetting>({ name: 'filter.domain.enabled' });

  return (
    <FormCard title='フィルター設定'>
      <div className='flex flex-col gap-3'>
        <FormSubCard
          title='Discordサーバーの招待リンク'
          icon='solar:link-round-bold'
          isDisabled={!isEnabled}
        >
          <ControlledSwitch
            control={control}
            name='filter.inviteUrl'
            label='招待リンクをブロックする'
            description='このDiscordサーバー以外の招待リンクを含むメッセージを自動で削除します。'
            isDisabled={!isEnabled}
          />
        </FormSubCard>
        <FormSubCard
          title='Discordトークン'
          icon='solar:shield-keyhole-bold'
          isDisabled={!isEnabled}
        >
          <ControlledSwitch
            control={control}
            name='filter.token'
            label='Discordトークンをブロックする'
            description='Discordアカウントのトークンを含むメッセージを自動で削除します。'
            isDisabled={!isEnabled}
          />
        </FormSubCard>
        <FormSubCard title='ドメイン' icon='solar:global-bold' isDisabled={!isEnabled}>
          <ControlledSwitch
            control={control}
            name='filter.domain.enabled'
            label='特定のドメインをブロックする'
            description='特定のドメインのURLを含むメッセージを自動で削除します。'
            isDisabled={!isEnabled}
          />
          <ControlledArrayTextarea
            control={control}
            name='filter.domain.list'
            label='ブロックするドメイン'
            description='ドメインはカンマ（例: nonick-js.com, discord.com）または改行で区分してください。'
            variant='bordered'
            classNames={{
              inputWrapper: 'bg-content1',
              innerWrapper: 'flex-col items-end',
            }}
            maxArrayLength={20}
            isDisabled={!isEnabled || !isDomainFilterEnabled}
          />
        </FormSubCard>
      </div>
    </FormCard>
  );
}

function IgnoreSetting() {
  const { control } = useFormContext<InputSetting>();
  const { channels, roles } = useContext(PropsContext);
  const { guildId } = useParams<{ guildId: string }>();

  const isEnabled = useWatch<InputSetting>({ name: 'enabled' });

  return (
    <FormCard title='例外設定'>
      <Alert
        variant='faded'
        color='primary'
        description='「サーバー管理」権限を持っているユーザーやBOTは、設定に関わらず全てのフィルターが適用されません。'
      />
      <ChannelSelect
        control={control}
        name='ignore.channels'
        channels={channels}
        channelTypeFilter={{ exclude: [ChannelType.GuildCategory] }}
        label='フィルターを適用しないチャンネル'
        description='選択したチャンネルのスレッドもフィルターが適用されなくなります。'
        selectionMode='multiple'
        isDisabled={!isEnabled}
      />
      <RoleSelect
        control={control}
        name='ignore.roles'
        roles={roles}
        disableItemFilter={(role) => role.id === guildId}
        label='フィルターを適用しないロール'
        selectionMode='multiple'
        isDisabled={!isEnabled}
      />
    </FormCard>
  );
}

function LogSetting() {
  const { control } = useFormContext<InputSetting>();
  const { channels } = useContext(PropsContext);

  const isEnabled = useWatch<InputSetting>({ name: 'enabled' });
  const isLogEnabled = useWatch<InputSetting>({ name: 'log.enabled' });

  return (
    <FormCard title='ログ設定'>
      <ControlledSwitch
        control={control}
        name='log.enabled'
        label='ログを有効にする'
        description='フィルターによってメッセージが削除された際にログを送信します。'
        isDisabled={!isEnabled}
      />
      <ChannelSelect
        control={control}
        name='log.channel'
        label='ログを送信するチャンネル'
        channels={channels}
        channelTypeFilter={{ include: [ChannelType.GuildText] }}
        isRequired
        isDisabled={!isEnabled || !isLogEnabled}
      />
    </FormCard>
  );
}
// #endregion
