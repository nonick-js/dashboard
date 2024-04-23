'use client';

import type { GuildChannel } from '@/@types/discord';
import {
  FormCard,
  FormLabel,
  FormLabelLayout,
  FormValueViewer,
  SubmitButton,
} from '@/components/form';
import { ChannelSelect } from '@/components/ui/selects/channel-select';
import { RoleSelect } from '@/components/ui/selects/role-select';
import { useToast } from '@/components/ui/use-toast';
import { ReportConfig } from '@/database/zod/config';
import { Snowflake } from '@/database/zod/discord';
import { useFormGuard } from '@/hooks/use-form-guard';
import { zodResolver } from '@hookform/resolvers/zod';
import { Switch } from '@nextui-org/react';
import { type APIRole, ChannelType } from 'discord-api-types/v10';
import { useParams } from 'next/navigation';
import { createContext, useContext } from 'react';
import { Controller, FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form';
import type * as z from 'zod';
import { updateConfig } from '../../action';

type Props = {
  channels: GuildChannel[];
  roles: APIRole[];
  config: z.infer<typeof ReportConfig> | null;
};

const FormContext = createContext<Props>({
  channels: [],
  roles: [],
  config: null,
});

export default function Form(props: Props) {
  const { toast } = useToast();
  const guildId = Snowflake.parse(useParams().guildId);

  const form = useForm<z.infer<typeof ReportConfig>>({
    resolver: zodResolver(ReportConfig),
    defaultValues: props.config ?? {
      guildId,
      channel: '',
      includeModerator: false,
      progressButton: true,
      mention: {
        enabled: false,
        roles: [],
      },
    },
  });

  useFormGuard(form.formState.isDirty);

  async function onSubmit(value: z.infer<typeof ReportConfig>) {
    const res = await updateConfig.bind(null, 'report')(value);
    toast(res.message);
    if (res.isSuccess) form.reset(value);
  }

  return (
    <FormContext.Provider value={props}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
          <RequireConfig />
          <GeneralConfig />
          <NotificationConfig />
          <FormValueViewer />
          <SubmitButton />
        </form>
      </FormProvider>
    </FormContext.Provider>
  );
}

function RequireConfig() {
  const { channels } = useContext(FormContext);
  const form = useFormContext<z.infer<typeof ReportConfig>>();

  return (
    <FormCard>
      <FormLabelLayout mobileDir='col'>
        <FormLabel id='channel' title='通報を受け取るチャンネル' isRequired />
        <Controller
          control={form.control}
          name='channel'
          render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
            <ChannelSelect
              aria-labelledby='channel'
              ref={ref}
              onChange={onChange}
              defaultSelectedKeys={value ? [value] : []}
              channels={channels}
              types={{ allow: [ChannelType.GuildText] }}
              isInvalid={!!error}
              errorMessage={error?.message}
              isRequired
            />
          )}
        />
      </FormLabelLayout>
    </FormCard>
  );
}

function GeneralConfig() {
  const form = useFormContext<z.infer<typeof ReportConfig>>();

  return (
    <FormCard title='基本設定'>
      <FormLabelLayout>
        <FormLabel
          id='includeModerator'
          title='モデレーターも通報の対象にする'
          description='有効にすると、「メンバー管理」権限を持つユーザーをメンバーが通報できるようになります。'
        />
        <Controller
          control={form.control}
          name='includeModerator'
          render={({ field: { ref, onChange, value } }) => (
            <Switch
              aria-labelledby='includeModerator'
              ref={ref}
              onChange={onChange}
              defaultSelected={value}
            />
          )}
        />
      </FormLabelLayout>
      <FormLabelLayout>
        <FormLabel
          id='progressButton'
          title='進捗ボタンを表示する'
          description='送られた通報に「対処済み」「無視」などの、通報のステータスを管理できるボタンを表示します。'
        />
        <Controller
          control={form.control}
          name='progressButton'
          render={({ field: { ref, onChange, value } }) => (
            <Switch
              aria-labelledby='progressButton'
              ref={ref}
              onChange={onChange}
              defaultSelected={value}
            />
          )}
        />
      </FormLabelLayout>
    </FormCard>
  );
}

function NotificationConfig() {
  const { roles } = useContext(FormContext);
  const form = useFormContext<z.infer<typeof ReportConfig>>();
  const { mention, guildId } = useWatch<z.infer<typeof ReportConfig>>();

  return (
    <FormCard title='通知設定'>
      <FormLabelLayout>
        <FormLabel
          id='mention.enabled'
          title='メンション通知を有効にする'
          description='通報が送られた際に特定のロールをメンションします'
        />
        <Controller
          control={form.control}
          name='mention.enabled'
          render={({ field: { ref, onChange, value } }) => (
            <Switch
              aria-labelledby='mention.enabled'
              ref={ref}
              onChange={onChange}
              defaultSelected={value}
            />
          )}
        />
      </FormLabelLayout>
      <FormLabelLayout dir='col'>
        <FormLabel
          id='mention.roles'
          title='メンションするロール'
          isRequired
          isDisabled={!mention?.enabled}
        />
        <Controller
          control={form.control}
          name='mention.roles'
          render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
            <RoleSelect
              aria-labelledby='mention.roles'
              ref={ref}
              onSelectionChange={(keys) => onChange(Array.from(keys))}
              defaultSelectedKeys={value.filter((id) => roles.some((role) => role.id === id))}
              selectionMode='multiple'
              roles={roles}
              filter={(role) => !role.managed && role.id !== guildId}
              isInvalid={!!error}
              errorMessage={error?.message}
              isDisabled={!mention?.enabled}
            />
          )}
        />
      </FormLabelLayout>
    </FormCard>
  );
}
