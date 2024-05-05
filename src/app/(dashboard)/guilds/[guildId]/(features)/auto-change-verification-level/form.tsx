'use client';

import type { GuildChannel } from '@/@types/discord';
import { FormCard, FormValueViewer, SubmitButton } from '@/components/form-utils';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { ChannelSelect } from '@/components/ui/selects/channel-select';
import { useToast } from '@/components/ui/use-toast';
import { AutoChangeVerifyLevelConfig } from '@/database/zod/config';
import { Snowflake } from '@/database/zod/discord';
import { useFormGuard } from '@/hooks/use-form-guard';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify-icon/react';
import { Input, Radio, RadioGroup, Switch } from '@nextui-org/react';
import { ChannelType, GuildVerificationLevel } from 'discord-api-types/v10';
import { useParams } from 'next/navigation';
import React, { type HTMLAttributes, createContext, useContext } from 'react';
import { FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form';
import type * as z from 'zod';
import { updateConfig } from '../../action';

type Config = z.infer<typeof AutoChangeVerifyLevelConfig>;
type Props = {
  channels: GuildChannel[];
  config: Config | null;
};

const PropsContext = createContext<Props>({
  channels: [],
  config: null,
});

export default function Form(props: Props) {
  const { toast } = useToast();
  const guildId = Snowflake.parse(useParams().guildId);

  const form = useForm<Config>({
    resolver: zodResolver(AutoChangeVerifyLevelConfig),
    defaultValues: props.config ?? {
      guildId,
      enabled: false,
      level: GuildVerificationLevel.Low,
      startHour: 0,
      endHour: 6,
      log: {
        enabled: false,
        channel: null,
      },
    },
  });

  useFormGuard(form.formState.isDirty);

  async function onSubmit(value: Config) {
    const res = await updateConfig.bind(null, 'autoChangeVerifyLevel')(value);
    toast(res.message);
    if (res.isSuccess) form.reset(value);
  }

  return (
    <PropsContext.Provider value={props}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
          <EnableConfigForm />
          <GeneralConfigForm />
          <LogConfigForm />
          <FormValueViewer />
          <SubmitButton />
        </form>
      </FormProvider>
    </PropsContext.Provider>
  );
}

function EnableConfigForm() {
  const form = useFormContext<Config>();

  return (
    <FormCard>
      <FormField
        control={form.control}
        name='enabled'
        render={({ field: { ref, onChange, value } }) => (
          <FormItem>
            <FormLabel title='自動認証レベル変更を有効にする' />
            <FormControl ref={ref}>
              <Switch onChange={onChange} defaultSelected={value} />
            </FormControl>
          </FormItem>
        )}
      />
    </FormCard>
  );
}

type HourInputProps = {
  value: number;
  isInvalid: boolean;
  isDisabled: boolean;
};

const HourInput = React.forwardRef<
  HTMLInputElement,
  HTMLAttributes<HTMLInputElement> & HourInputProps
>(({ onChange, value, isInvalid, isDisabled, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      classNames={{ base: 'w-[180px]' }}
      onChange={onChange}
      defaultValue={String(value)}
      variant='bordered'
      type='number'
      startContent={
        <Icon className='text-[20px] text-foreground-400' icon='solar:clock-circle-bold' />
      }
      endContent={<span className='text-small text-foreground-400'>:00</span>}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
    />
  );
});

function GeneralConfigForm() {
  const form = useFormContext<Config>();
  const { enabled } = useWatch<Config>();

  return (
    <FormCard title='全般設定'>
      <div className='flex flex-col gap-3'>
        <FormField
          control={form.control}
          name='startHour'
          render={({ field: { ref, onChange, value }, fieldState: { invalid } }) => (
            <FormItem>
              <FormLabel title='開始時間 (0～23)' isRequired isDisabled={!enabled} />
              <FormControl ref={ref}>
                <HourInput
                  onChange={onChange}
                  value={value}
                  isInvalid={invalid}
                  isDisabled={!enabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='endHour'
          render={({ field: { ref, onChange, value }, fieldState: { invalid } }) => (
            <FormItem>
              <FormLabel title='終了時間 (0～23)' isRequired isDisabled={!enabled} />
              <FormControl ref={ref}>
                <HourInput
                  onChange={onChange}
                  value={value}
                  isInvalid={invalid}
                  isDisabled={!enabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name='level'
        render={({ field: { ref, onChange, value }, fieldState: { invalid } }) => (
          <FormItem mobileDir='col'>
            <FormLabel title='期間内に設定する認証レベル' isRequired isDisabled={!enabled} />
            <FormControl ref={ref}>
              <RadioGroup
                onChange={(e) => onChange(Number(e.target.value))}
                defaultValue={String(value)}
                isDisabled={!enabled}
                isInvalid={invalid}
              >
                <Radio
                  classNames={{ label: 'text-green-500' }}
                  value={String(GuildVerificationLevel.Low)}
                  description='メール認証がされているアカウントのみ'
                >
                  低
                </Radio>
                <Radio
                  classNames={{ label: 'text-yellow-500' }}
                  value={String(GuildVerificationLevel.Medium)}
                  description='Discordに登録してから5分以上経過したアカウントのみ'
                >
                  中
                </Radio>
                <Radio
                  classNames={{ label: 'text-orange-500' }}
                  value={String(GuildVerificationLevel.High)}
                  description='このサーバーのメンバーとなってから10分以上経過したアカウントのみ'
                >
                  高
                </Radio>
                <Radio
                  classNames={{ label: 'text-red-500' }}
                  value={String(GuildVerificationLevel.VeryHigh)}
                  description='電話認証がされているアカウントのみ'
                >
                  最高
                </Radio>
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />
    </FormCard>
  );
}

function LogConfigForm() {
  const { channels } = useContext(PropsContext);
  const form = useFormContext<Config>();
  const { enabled, log } = useWatch<Config>();

  return (
    <FormCard title='ログ設定'>
      <FormField
        control={form.control}
        name='log.enabled'
        render={({ field: { ref, onChange, value } }) => (
          <FormItem>
            <FormLabel
              title='ログを有効にする'
              description='自動変更の開始・終了時にログを送信します。'
              isDisabled={!enabled}
            />
            <FormControl ref={ref}>
              <Switch onChange={onChange} defaultSelected={value} isDisabled={!enabled} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='log.channel'
        render={({ field: { ref, onChange, value }, fieldState: { invalid } }) => (
          <FormItem mobileDir='col'>
            <FormLabel
              title='ログを送信するチャンネル'
              isDisabled={!enabled || !log?.enabled}
              isRequired
            />
            <FormControl ref={ref}>
              <ChannelSelect
                onChange={onChange}
                defaultSelectedKeys={value ? [value] : []}
                channels={channels}
                types={{ allow: [ChannelType.GuildText] }}
                isInvalid={invalid}
                isDisabled={!enabled || !log?.enabled}
                disallowEmptySelection
              />
            </FormControl>
          </FormItem>
        )}
      />
    </FormCard>
  );
}
