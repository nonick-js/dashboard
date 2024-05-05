'use client';

import type { GuildChannel } from '@/@types/discord';
import { FormCard, FormValueViewer, SubmitButton } from '@/components/form-utils';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { ChannelSelect } from '@/components/ui/selects/channel-select';
import { useToast } from '@/components/ui/use-toast';
import { AutoPublicConfig } from '@/database/zod/config';
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

type Config = z.infer<typeof AutoPublicConfig>;
type Props = {
  channels: GuildChannel[];
  config: Config | null;
};

const FormContext = createContext<Props>({
  channels: [],
  config: null,
});

export default function Form(props: Props) {
  const { toast } = useToast();
  const guildId = Snowflake.parse(useParams().guildId);

  const form = useForm<Config>({
    resolver: zodResolver(AutoPublicConfig),
    defaultValues: props.config ?? {
      guildId,
      enabled: false,
      channels: [],
    },
  });

  useFormGuard(form.formState.isDirty);

  async function onSubmit(value: Config) {
    const res = await updateConfig.bind(null, 'autoPublic')(value);
    toast(res.message);
    if (res.message) form.reset(value);
  }

  return (
    <FormContext.Provider value={props}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
          <EnableConfig />
          <GeneralConfig />
          <FormValueViewer />
          <SubmitButton />
        </form>
      </FormProvider>
    </FormContext.Provider>
  );
}

function EnableConfig() {
  const form = useFormContext<Config>();

  return (
    <FormCard>
      <FormField
        control={form.control}
        name='enabled'
        render={({ field: { ref, onChange, value } }) => (
          <FormItem>
            <FormLabel title='自動アナウンス公開を有効にする' />
            <FormControl ref={ref}>
              <Switch onChange={onChange} defaultSelected={value} />
            </FormControl>
          </FormItem>
        )}
      />
    </FormCard>
  );
}

function GeneralConfig() {
  const form = useFormContext<Config>();
  const { channels } = useContext(FormContext);
  const { enabled } = useWatch<Config>();

  return (
    <FormCard>
      <FormField
        control={form.control}
        name='channels'
        render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
          <FormItem mobileDir='col'>
            <FormLabel title='自動公開するチャンネル' isDisabled={!enabled} />
            <FormControl ref={ref}>
              <ChannelSelect
                onSelectionChange={(keys) => onChange(Array.from(keys))}
                defaultSelectedKeys={value.filter((id) => channels.some((ch) => ch.id === id))}
                selectionMode='multiple'
                channels={channels}
                types={{ allow: [ChannelType.GuildAnnouncement] }}
                isInvalid={!!error}
                isDisabled={!enabled}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </FormCard>
  );
}
