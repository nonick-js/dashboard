'use client';

import type { GuildChannel } from '@/@types/discord';
import { FormCard, FormValueViewer, SubmitButton } from '@/components/form-utils';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
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
import { FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form';
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
      <FormField
        control={form.control}
        name='channel'
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <FormItem mobileDir='col'>
            <FormLabel title='通報を受け取るチャンネル' isRequired />
            <FormControl>
              <ChannelSelect
                onChange={onChange}
                defaultSelectedKeys={value ? [value] : []}
                channels={channels}
                types={{ allow: [ChannelType.GuildText] }}
                isInvalid={!!error}
                isRequired
              />
            </FormControl>
          </FormItem>
        )}
      />
    </FormCard>
  );
}

function GeneralConfig() {
  const form = useFormContext<z.infer<typeof ReportConfig>>();

  return (
    <FormCard title='基本設定'>
      <FormField
        control={form.control}
        name='includeModerator'
        render={({ field: { onChange, value } }) => (
          <FormItem>
            <FormLabel
              title='モデレーターも通報の対象にする'
              description='有効にすると、「メンバー管理」権限を持つユーザーをメンバーが通報できるようになります。'
            />
            <FormControl>
              <Switch onChange={onChange} defaultSelected={value} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='progressButton'
        render={({ field: { onChange, value } }) => (
          <FormItem>
            <FormLabel
              title='進捗ボタンを表示する'
              description='送られた通報に「対処済み」「無視」などの、通報のステータスを管理できるボタンを表示します。'
            />
            <FormControl>
              <Switch onChange={onChange} defaultSelected={value} />
            </FormControl>
          </FormItem>
        )}
      />
    </FormCard>
  );
}

function NotificationConfig() {
  const { roles } = useContext(FormContext);
  const form = useFormContext<z.infer<typeof ReportConfig>>();
  const { mention, guildId } = useWatch<z.infer<typeof ReportConfig>>();

  return (
    <FormCard title='通知設定'>
      <FormField
        control={form.control}
        name='mention.enabled'
        render={({ field: { onChange, value } }) => (
          <FormItem>
            <FormLabel
              title='メンション通知を有効にする'
              description='通報が送られた際に特定のロールをメンションします。'
            />
            <FormControl>
              <Switch onChange={onChange} defaultSelected={value} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='mention.roles'
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <FormItem dir='row' mobileDir='col'>
            <FormLabel title='メンションするロール' isRequired isDisabled={!mention?.enabled} />
            <FormControl>
              <RoleSelect
                onSelectionChange={(keys) => onChange(Array.from(keys))}
                defaultSelectedKeys={value.filter((id) => roles.some((role) => role.id === id))}
                selectionMode='multiple'
                roles={roles}
                filter={(role) => !role.managed && role.id !== guildId}
                isInvalid={!!error}
                isDisabled={!mention?.enabled}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </FormCard>
  );
}
