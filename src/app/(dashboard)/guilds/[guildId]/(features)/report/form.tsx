'use client';

import type { GuildChannel } from '@/@types/discord';
import {
  FormCard,
  FormSwitchClassNames,
  FormValueViewer,
  SubmitButton,
  SwitchLabel,
} from '@/components/form';
import { ChannelSelect } from '@/components/ui/selects/channel-select';
import { RoleSelect } from '@/components/ui/selects/role-select';
import { useToast } from '@/components/ui/use-toast';
import { ReportConfig } from '@/database/zod/config';
import { Snowflake } from '@/database/zod/discord';
import { useFormGuard } from '@/hooks/use-form-guard';
import { TailwindCSS } from '@/lib/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { Switch } from '@nextui-org/react';
import { type APIRole, ChannelType } from 'discord-api-types/v10';
import { useParams } from 'next/navigation';
import { createContext, useContext } from 'react';
import { Controller, FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form';
import { useMediaQuery } from 'react-responsive';
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

export default function ReportConfigForm(props: Props) {
  const { toast } = useToast();
  const guildId = Snowflake.parse(useParams().guildId);

  const form = useForm<z.infer<typeof ReportConfig>>({
    resolver: zodResolver(ReportConfig),
    defaultValues: props.config ?? {
      guildId: guildId,
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
          <NotificationSetting />
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
  const isTablet = useMediaQuery({ query: TailwindCSS.MediaQuery.md });

  return (
    <FormCard>
      <Controller
        control={form.control}
        name='channel'
        render={({ field, fieldState: { error } }) => (
          <ChannelSelect
            label='通報を受け取るチャンネル'
            labelPlacement={isTablet ? 'outside-left' : 'outside'}
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
    </FormCard>
  );
}

function GeneralConfig() {
  const form = useFormContext<z.infer<typeof ReportConfig>>();

  return (
    <FormCard title='基本設定'>
      <Controller
        control={form.control}
        name='includeModerator'
        render={({ field }) => (
          <Switch
            ref={field.ref}
            classNames={FormSwitchClassNames}
            onChange={field.onChange}
            defaultSelected={field.value}
          >
            <SwitchLabel
              title='モデレーターも通報の対象にする'
              description='有効にすると、「サーバー管理」権限を持つユーザーをメンバーが通報できるようになります。'
            />
          </Switch>
        )}
      />
      <Controller
        control={form.control}
        name='progressButton'
        render={({ field }) => (
          <Switch
            classNames={FormSwitchClassNames}
            onChange={field.onChange}
            defaultSelected={field.value}
          >
            <SwitchLabel
              title='進捗ボタンを表示する'
              description='送られた通報に「対処済み」「無視」などの、通報のステータスを管理できるボタンを表示します。'
            />
          </Switch>
        )}
      />
    </FormCard>
  );
}

function NotificationSetting() {
  const { roles } = useContext(FormContext);
  const form = useFormContext<z.infer<typeof ReportConfig>>();
  const { mention } = useWatch<z.infer<typeof ReportConfig>>();
  const isTablet = useMediaQuery({ query: TailwindCSS.MediaQuery.md });

  return (
    <FormCard title='通知設定'>
      <Controller
        control={form.control}
        name='mention.enabled'
        render={({ field }) => (
          <Switch
            classNames={FormSwitchClassNames}
            onChange={field.onChange}
            defaultSelected={field.value}
          >
            <SwitchLabel
              title='メンション通知を有効にする'
              description='通報が送られた際に特定のロールをメンションします'
            />
          </Switch>
        )}
      />
      <Controller
        control={form.control}
        name='mention.roles'
        render={({ field, fieldState: { error } }) => (
          <RoleSelect
            label='メンションするロール'
            labelPlacement='inside'
            roles={roles}
            filter={(role) => !role.managed}
            onSelectionChange={(keys) => field.onChange(Array.from(keys))}
            selectionMode='multiple'
            defaultSelectedKeys={field.value}
            isInvalid={!!error}
            errorMessage={error?.message}
            isDisabled={!mention?.enabled}
          />
        )}
      />
    </FormCard>
  );
}
