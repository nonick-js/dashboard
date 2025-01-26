'use client';

import { FormCard } from '@/components/form';
import { Icon } from '@/components/icon';
import { FormChangePublisher } from '@/components/react-hook-form/change-publisher';
import { ChannelSelect } from '@/components/react-hook-form/channel-select';
import { ControlledForm } from '@/components/react-hook-form/form';
import { ControlledInput, type ControlledInputProps } from '@/components/react-hook-form/input';
import { ControlledRadioGroup } from '@/components/react-hook-form/radio';
import { ControlledSwitch } from '@/components/react-hook-form/switch';
import { AutoChangeVerifyLevelZodSchema } from '@/lib/database/zod';
import type { getChannels } from '@/lib/discord';
import { convertNumbersToStrings } from '@/lib/utils';
import { Radio } from '@heroui/radio';
import { cn } from '@heroui/theme';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChannelType, GuildVerificationLevel } from 'discord-api-types/v10';
import { useParams } from 'next/navigation';
import { createContext, useContext } from 'react';
import {
  type FieldPath,
  type FieldValues,
  type SubmitHandler,
  type UseControllerProps,
  useForm,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import toast from 'react-hot-toast';
import type { z } from 'zod';
import { updateSetting } from './action';

// #region Types, Context
type InputSetting = z.input<typeof AutoChangeVerifyLevelZodSchema>;
type OutputSetting = z.output<typeof AutoChangeVerifyLevelZodSchema>;

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
    resolver: zodResolver(AutoChangeVerifyLevelZodSchema),
    defaultValues: setting
      ? convertNumbersToStrings(setting)
      : {
          enabled: false,
          level: String(GuildVerificationLevel.Low),
          startHour: String(0),
          endHour: String(6),
          log: {
            enabled: false,
            channel: null,
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
        <EnableSetting />
        <GeneralSetting />
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
      <ControlledSwitch control={control} name='enabled' label='自動認証レベル変更を有効にする' />
    </FormCard>
  );
}

function GeneralSetting() {
  const { control } = useFormContext<InputSetting>();

  const isEnabled = useWatch<InputSetting>({ name: 'enabled' });

  return (
    <FormCard title='全般設定'>
      <div className='w-full flex gap-6'>
        <HourInput
          control={control}
          name='startHour'
          label='開始時間（0～23）'
          isDisabled={!isEnabled}
        />
        <HourInput
          control={control}
          name='endHour'
          label='終了時間（0～23）'
          isDisabled={!isEnabled}
        />
      </div>
      <ControlledRadioGroup
        control={control}
        name='level'
        label='期間内に設定する認証レベル'
        isDisabled={!isEnabled}
        isRequired
      >
        <Radio
          classNames={CustomRadioClassName(GuildVerificationLevel.Low)}
          value={String(GuildVerificationLevel.Low)}
          description='メール認証がされているアカウントのみ'
        >
          低
        </Radio>
        <Radio
          classNames={CustomRadioClassName(GuildVerificationLevel.Medium)}
          value={String(GuildVerificationLevel.Medium)}
          description='Discordに登録してから5分以上経過したアカウントのみ'
        >
          中
        </Radio>
        <Radio
          classNames={CustomRadioClassName(GuildVerificationLevel.High)}
          value={String(GuildVerificationLevel.High)}
          description='このサーバーのメンバーとなってから10分以上経過したアカウントのみ'
        >
          高
        </Radio>
        <Radio
          classNames={CustomRadioClassName(GuildVerificationLevel.VeryHigh)}
          value={String(GuildVerificationLevel.VeryHigh)}
          description='電話認証がされているアカウントのみ'
        >
          最高
        </Radio>
      </ControlledRadioGroup>
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
        description='自動変更の開始・終了時にログを送信します。'
        isDisabled={!isEnabled}
      />
      <ChannelSelect
        control={control}
        name='log.channel'
        channels={channels}
        channelTypeFilter={{ include: [ChannelType.GuildText] }}
        label='ログを送信するチャンネル'
        isRequired
        isDisabled={!isEnabled || !isLogEnabled}
      />
    </FormCard>
  );
}
// #endregion

// #region Components
function HourInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: ControlledInputProps & UseControllerProps<TFieldValues, TName>) {
  return (
    <ControlledInput
      type='number'
      min={0}
      max={23}
      startContent={
        <Icon
          className='text-foreground-500 group-data-[invalid=true]:text-danger-400'
          icon='solar:clock-circle-bold'
          width={20}
          height={20}
        />
      }
      endContent={
        <span className='text-small text-foreground-500 group-data-[invalid=true]:text-danger-400'>
          :00
        </span>
      }
      isRequired
      {...props}
    />
  );
}

function CustomRadioClassName(color: Omit<GuildVerificationLevel, 'None'>) {
  return {
    base: cn(
      'inline-flex m-0 bg-default-100 hover:bg-default-100/80 items-center justify-between w-full max-w-none',
      'w-full cursor-pointer rounded-lg gap-2 px-4 py-3 text-sm',
    ),
    label: cn(
      { 'text-green-500': color === GuildVerificationLevel.Low },
      { 'text-yellow-500': color === GuildVerificationLevel.Medium },
      { 'text-orange-500': color === GuildVerificationLevel.High },
      { 'text-red-500': color === GuildVerificationLevel.VeryHigh },
    ),
    description: 'text-sm text-default-500',
    labelWrapper: 'flex-1',
  };
}
// #endregion
