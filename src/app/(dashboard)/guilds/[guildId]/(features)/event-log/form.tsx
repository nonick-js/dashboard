'use client';

import type { GuildChannel } from '@/@types/discord';
import { FormCard, FormValueViewer, SubmitButton } from '@/components/form-utils';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { ChannelSelect } from '@/components/ui/selects/channel-select';
import { useToast } from '@/components/ui/use-toast';
import { EventLogConfig } from '@/database/zod/config';
import { Snowflake } from '@/database/zod/discord';
import { useFormGuard } from '@/hooks/use-form-guard';
import { zodResolver } from '@hookform/resolvers/zod';
import { Switch } from '@nextui-org/react';
import { ChannelType } from 'discord-api-types/v10';
import { useParams } from 'next/navigation';
import { createContext, useContext } from 'react';
import { FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form';
import type * as z from 'zod';
import { updateConfig } from '../../action';

type Config = z.infer<typeof EventLogConfig>;
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
    resolver: zodResolver(EventLogConfig),
    defaultValues: props.config ?? {
      guildId,
      timeout: { enabled: false, channel: null },
      kick: { enabled: false, channel: null },
      ban: { enabled: false, channel: null },
      voice: { enabled: false, channel: null },
      messageDelete: { enabled: false, channel: null },
      messageEdit: { enabled: false, channel: null },
    },
  });

  useFormGuard(form.formState.isDirty);

  async function onSubmit(value: Config) {
    const res = await updateConfig.bind(null, 'eventLog')(value);
    toast(res.message);
    if (res.isSuccess) form.reset(value);
  }

  return (
    <PropsContext.Provider value={props}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
          <LogConfig
            name='timeout'
            cardTitle='タイムアウト'
            labelTitle='タイムアウトログを有効にする'
            labelDescription='メンバーをタイムアウトしたり、タイムアウトを手動で解除したりした際にログを送信します。'
          />
          <LogConfig
            name='kick'
            cardTitle='キック'
            labelTitle='キックログを有効にする'
            labelDescription='メンバーをキックした際にログを送信します。'
          />
          <LogConfig
            name='ban'
            cardTitle='BAN'
            labelTitle='BANログを有効にする'
            labelDescription='メンバーをBANしたり、BANを解除した際にログを送信します。'
          />
          <LogConfig
            name='voice'
            cardTitle='ボイスチャット'
            labelTitle='VCログを有効にする'
            labelDescription='ボイスチャットの入室や退室、移動があった際にログを送信します。'
          />
          <LogConfig
            name='messageDelete'
            cardTitle='メッセージ削除'
            labelTitle='削除ログを有効にする'
            labelDescription='メッセージが削除された際にログを送信します。'
          />
          <LogConfig
            name='messageEdit'
            cardTitle='メッセージ編集'
            labelTitle='編集ログを有効にする'
            labelDescription='メッセージが編集された際にログを送信します。'
          />
          <FormValueViewer />
          <SubmitButton />
        </form>
      </FormProvider>
    </PropsContext.Provider>
  );
}

function LogConfig({
  name,
  cardTitle,
  labelTitle,
  labelDescription,
}: {
  name: keyof Omit<Config, 'guildId'>;
  cardTitle: string;
  labelTitle: string;
  labelDescription: string;
}) {
  const { channels } = useContext(PropsContext);
  const watch = useWatch<Config>();
  const form = useFormContext<Config>();

  return (
    <FormCard title={cardTitle}>
      <FormField
        control={form.control}
        name={`${name}.enabled`}
        render={({ field: { ref, onChange, value } }) => (
          <FormItem>
            <FormLabel title={labelTitle} description={labelDescription} />
            <FormControl ref={ref}>
              <Switch onChange={onChange} defaultSelected={value} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${name}.channel`}
        render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
          <FormItem mobileDir='col'>
            <FormLabel
              title='ログを送信するチャンネル'
              isDisabled={!watch?.[name]?.enabled}
              isRequired
            />
            <FormControl ref={ref}>
              <ChannelSelect
                onChange={onChange}
                defaultSelectedKeys={value ? [value] : []}
                channels={channels}
                types={{ allow: [ChannelType.GuildText] }}
                isInvalid={!!error}
                isDisabled={!watch?.[name]?.enabled}
                disallowEmptySelection
              />
            </FormControl>
          </FormItem>
        )}
      />
    </FormCard>
  );
}
