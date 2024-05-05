'use client';

import type { GuildChannel } from '@/@types/discord';
import { FormCard, FormValueViewer, SubmitButton } from '@/components/form-utils';
import { FormControl, FormField, FormItem, FormLabel, FormTitle } from '@/components/ui/form';
import { ChannelSelect } from '@/components/ui/selects/channel-select';
import { useToast } from '@/components/ui/use-toast';
import { MessageExpandConfig } from '@/database/zod/config';
import { Snowflake } from '@/database/zod/discord';
import { useFormGuard } from '@/hooks/use-form-guard';
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox, CheckboxGroup, Switch, Textarea, cn } from '@nextui-org/react';
import { ChannelType } from 'discord-api-types/v10';
import { useParams } from 'next/navigation';
import { createContext, useContext } from 'react';
import { FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form';
import type * as z from 'zod';
import { updateConfig } from '../../action';

type Config = z.infer<typeof MessageExpandConfig>;
type Props = {
  channels: GuildChannel[];
  config: Config | null;
};

const FormContext = createContext<Props>({
  channels: [],
  config: null,
});

export default function MessageExpandConfigForm(props: Props) {
  const { toast } = useToast();
  const guildId = Snowflake.parse(useParams().guildId);

  const form = useForm<Config>({
    resolver: zodResolver(MessageExpandConfig),
    defaultValues: props.config ?? {
      guildId,
      enabled: false,
      allowExternalGuild: false,
      ignore: {
        channels: [],
        types: [],
        prefixes: [],
      },
    },
  });

  useFormGuard(form.formState.isDirty);

  async function onSubmit(value: Config) {
    const res = await updateConfig.bind(null, 'messageExpand')(value);
    toast(res.message);
    if (res.isSuccess) form.reset(value);
  }

  return (
    <FormContext.Provider value={props}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
          <EnableConfig />
          <GeneralConfig />
          <IgnoreConfig />
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
            <FormLabel title='メッセージURL展開を有効にする' />
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
  const { enabled } = useWatch<Config>();

  return (
    <FormCard title='全般設定'>
      <FormField
        control={form.control}
        name='allowExternalGuild'
        render={({ field: { ref, onChange, value } }) => (
          <FormItem>
            <FormLabel
              title='外部サーバーでの展開を許可する'
              description='このサーバーのメッセージURLを他のDiscordサーバーでも展開できるようにします。'
              isDisabled={!enabled}
            />
            <FormControl ref={ref}>
              <Switch onChange={onChange} defaultSelected={value} isDisabled={!enabled} />
            </FormControl>
          </FormItem>
        )}
      />
    </FormCard>
  );
}

function IgnoreConfig() {
  const form = useFormContext<Config>();
  const { enabled } = useWatch<Config>();
  const { channels } = useContext(FormContext);

  return (
    <FormCard title='例外設定'>
      <FormField
        control={form.control}
        name='ignore.types'
        render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
          <FormItem mobileDir='col'>
            <FormLabel
              title='チャンネルの種類'
              description='特定の種類のチャンネルでURL展開を無効にします。'
              isDisabled={!enabled}
            />
            <FormControl ref={ref}>
              <CheckboxGroup
                size='lg'
                onValueChange={(v) => onChange(v.map((type) => Number(type)))}
                defaultValue={value.map((v) => String(v))}
                classNames={{ base: 'w-md', wrapper: 'gap-0' }}
                isInvalid={!!error}
                isDisabled={!enabled}
              >
                <CustomCheckbox
                  label='アナウンスチャンネル'
                  value={ChannelType.GuildAnnouncement}
                />
                <CustomCheckbox label='ステージチャンネル' value={ChannelType.GuildStageVoice} />
                <CustomCheckbox label='公開スレッド' value={ChannelType.PublicThread} />
                <CustomCheckbox label='プライベートスレッド' value={ChannelType.PrivateThread} />
              </CheckboxGroup>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='ignore.channels'
        render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
          <FormItem dir='row' mobileDir='col'>
            <FormLabel
              title='チャンネル'
              description='特定のチャンネルでURL展開を無効にします。'
              isDisabled={!enabled}
            />
            <FormControl ref={ref}>
              <ChannelSelect
                onSelectionChange={(keys) => onChange(Array.from(keys))}
                defaultSelectedKeys={value.filter((id) => channels.some((ch) => ch.id === id))}
                selectionMode='multiple'
                channels={channels}
                types={{ ignore: [ChannelType.GuildCategory] }}
                isInvalid={!!error}
                isDisabled={!enabled}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='ignore.prefixes'
        render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
          <FormItem dir='row' mobileDir='col'>
            <FormLabel
              title='プレフィックス'
              description='URLの前にこの文字があった場合、展開を行いません。'
              isDisabled={!enabled}
            />
            <div className='grid gap-1 items-end'>
              <FormControl ref={ref}>
                <Textarea
                  onChange={(e) =>
                    onChange(
                      e.target.value
                        .split(/,|\n/)
                        .filter((v) => !!v.length)
                        .map((v) => v.trim()),
                    )
                  }
                  defaultValue={value.join(', ')}
                  variant='bordered'
                  placeholder='プレフィックスを入力'
                  minRows={1}
                  isInvalid={!!error}
                  isDisabled={!enabled}
                  disableAnimation
                />
              </FormControl>
              <div className='flex justify-between gap-2 text-tiny text-foreground-400'>
                <p>カンマ(,) または改行でプレフィックスを区切ります</p>
                <p>
                  <span className={cn({ 'text-danger': value.length > 5 })}>{value.length}</span>/5
                </p>
              </div>
            </div>
          </FormItem>
        )}
      />
    </FormCard>
  );
}

function CustomCheckbox({ label, value }: { label: string; value: number }) {
  return (
    <Checkbox
      aria-label={label}
      classNames={{
        base: cn('inline-flex max-w-md w-full m-0', 'items-center justify-start'),
        label: 'text-sm w-full',
      }}
      value={String(value)}
    >
      {label}
    </Checkbox>
  );
}
