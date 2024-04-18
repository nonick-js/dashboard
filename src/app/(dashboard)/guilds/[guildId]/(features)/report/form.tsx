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
        <FormLabel title='通報を受け取るチャンネル' isRequired />
        <Controller
          control={form.control}
          name='channel'
          render={({ field, fieldState: { error } }) => (
            <ChannelSelect
              ref={field.ref}
              channels={channels}
              types={[ChannelType.GuildText]}
              onChange={field.onChange}
              defaultSelectedKeys={field.value ? [field.value] : []}
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
          title='モデレーターも通報の対象にする'
          description='有効にすると、「サーバー管理」権限を持つユーザーをメンバーが通報できるようになります。'
        />
        <Controller
          control={form.control}
          name='includeModerator'
          render={({ field }) => (
            <Switch ref={field.ref} onChange={field.onChange} defaultSelected={field.value} />
          )}
        />
      </FormLabelLayout>
      <FormLabelLayout>
        <FormLabel
          title='進捗ボタンを表示する'
          description='送られた通報に「対処済み」「無視」などの、通報のステータスを管理できるボタンを表示します。'
        />
        <Controller
          control={form.control}
          name='progressButton'
          render={({ field }) => (
            <Switch ref={field.ref} onChange={field.onChange} defaultSelected={field.value} />
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
          title='メンション通知を有効にする'
          description='通報が送られた際に特定のロールをメンションします'
        />
        <Controller
          control={form.control}
          name='mention.enabled'
          render={({ field }) => (
            <Switch ref={field.ref} onChange={field.onChange} defaultSelected={field.value} />
          )}
        />
      </FormLabelLayout>
      <FormLabelLayout dir='col'>
        <FormLabel title='メンションするロール' isRequired isDisabled={!mention?.enabled} />
        <Controller
          control={form.control}
          name='mention.roles'
          render={({ field, fieldState: { error } }) => (
            <RoleSelect
              selectionMode='multiple'
              roles={roles}
              filter={(role) => !role.managed && role.id !== guildId}
              onSelectionChange={(keys) => field.onChange(Array.from(keys))}
              defaultSelectedKeys={field.value.filter((id) => roles.some((role) => role.id === id))}
              isInvalid={!!error}
              errorMessage={error?.message}
              isDisabled={!mention?.enabled}
              isRequired
            />
          )}
        />
      </FormLabelLayout>
    </FormCard>
  );
}
