'use client';

import type { GuildChannel } from '@/@types/discord';
import {
  FormCard,
  FormLabel,
  FormLabelLayout,
  FormValueViewer,
  SubmitButton,
  SwitchLabel,
} from '@/components/form';
import { ChannelSelect } from '@/components/ui/selects/channel-select';
import { useToast } from '@/components/ui/use-toast';
import { MessageExpandConfig } from '@/database/zod/config';
import { Snowflake } from '@/database/zod/discord';
import { useFormGuard } from '@/hooks/use-form-guard';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify-icon/react/dist/iconify.mjs';
import { Button, Checkbox, CheckboxGroup, Input, Switch, cn } from '@nextui-org/react';
import { ChannelType } from 'discord-api-types/v10';
import { useParams } from 'next/navigation';
import { createContext, useContext } from 'react';
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import type * as z from 'zod';
import { updateConfig } from '../../action';

type Props = {
  channels: GuildChannel[];
  config: z.infer<typeof MessageExpandConfig> | null;
};

const FormContext = createContext<Props>({
  channels: [],
  config: null,
});

export default function MessageExpandConfigForm(props: Props) {
  const { toast } = useToast();
  const guildId = Snowflake.parse(useParams().guildId);

  const form = useForm<z.infer<typeof MessageExpandConfig>>({
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

  async function onSubmit(value: z.infer<typeof MessageExpandConfig>) {
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
  const form = useFormContext<z.infer<typeof MessageExpandConfig>>();

  return (
    <FormCard>
      <FormLabelLayout>
        <FormLabel id='enabled' title='メッセージURL展開を有効にする' />
        <Controller
          control={form.control}
          name='enabled'
          render={({ field: { ref, onChange, value } }) => (
            <Switch
              aria-labelledby='enabled'
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

function GeneralConfig() {
  const form = useFormContext<z.infer<typeof MessageExpandConfig>>();
  const { enabled } = useWatch<z.infer<typeof MessageExpandConfig>>();

  return (
    <FormCard title='全般設定'>
      <FormLabelLayout>
        <FormLabel
          id='allowExternalGuild'
          title='外部サーバーでの展開を許可する'
          description='このサーバーのメッセージURLを他のDiscordサーバーでも展開できるようにします。'
          isDisabled={!enabled}
        />
        <Controller
          control={form.control}
          name='allowExternalGuild'
          render={({ field: { ref, onChange, value } }) => (
            <Switch
              aria-labelledby='allowExternalGuild'
              ref={ref}
              onChange={onChange}
              defaultSelected={value}
              isDisabled={!enabled}
            />
          )}
        />
      </FormLabelLayout>
    </FormCard>
  );
}

function IgnoreConfig() {
  const form = useFormContext<z.infer<typeof MessageExpandConfig>>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'ignore.prefixes',
  });
  const { enabled } = useWatch<z.infer<typeof MessageExpandConfig>>();
  const { channels } = useContext(FormContext);

  return (
    <FormCard title='例外設定'>
      <FormLabelLayout mobileDir='col'>
        <FormLabel
          id='ignore.types'
          title='チャンネルの種類'
          description='特定の種類のチャンネルでURL展開を無効にします。'
          isDisabled={!enabled}
        />
        <Controller
          control={form.control}
          name='ignore.types'
          render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
            <CheckboxGroup
              aria-labelledby='ignore.types'
              size='lg'
              ref={ref}
              onValueChange={(v) => onChange(v.map((type) => Number(type)))}
              defaultValue={value.map((v) => String(v))}
              classNames={{ base: 'w-md', wrapper: 'gap-0' }}
              isInvalid={!!error}
              errorMessage={error?.message}
              isDisabled={!enabled}
            >
              <CustomCheckbox label='アナウンスチャンネル' value={ChannelType.GuildAnnouncement} />
              <CustomCheckbox label='ステージチャンネル' value={ChannelType.GuildStageVoice} />
              <CustomCheckbox label='公開スレッド' value={ChannelType.PublicThread} />
              <CustomCheckbox label='プライベートスレッド' value={ChannelType.PrivateThread} />
            </CheckboxGroup>
          )}
        />
      </FormLabelLayout>
      <FormLabelLayout dir='col'>
        <FormLabel
          id='ignore.channels'
          title='チャンネル'
          description='特定のチャンネルでURL展開を無効にします。'
          isDisabled={!enabled}
        />
        <Controller
          control={form.control}
          name='ignore.channels'
          render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
            <ChannelSelect
              aria-labelledby='ignore.channels'
              ref={ref}
              onSelectionChange={(keys) => onChange(Array.from(keys))}
              defaultSelectedKeys={value.filter((id) =>
                channels.some((channel) => channel.id === id),
              )}
              selectionMode='multiple'
              channels={channels}
              types={{ ignore: [ChannelType.GuildCategory] }}
              isInvalid={!!error}
              errorMessage={error?.message}
              isDisabled={!enabled}
            />
          )}
        />
      </FormLabelLayout>
      <FormLabelLayout mobileDir='col'>
        <FormLabel
          id='ignore.prefixes'
          title='プレフィックス'
          description='URLの前にこの文字があった場合、URL展開を行いません。'
          isDisabled={!enabled}
        />
        <div className='grid grid-col-1 md:w-xs gap-2'>
          {fields.map((item, index) => (
            <Controller
              control={form.control}
              name={`ignore.prefixes.${index}.value`}
              render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                <Input
                  aria-labelledby='ignore.prefixes'
                  key={item.id}
                  ref={ref}
                  onChange={onChange}
                  defaultValue={value}
                  variant='bordered'
                  isInvalid={!!error}
                  errorMessage={error?.message}
                  isDisabled={!enabled}
                  endContent={
                    <Icon
                      onClick={() => remove(index)}
                      icon='solar:trash-bin-minimalistic-bold'
                      className='text-[20px] text-danger cursor-pointer'
                    />
                  }
                />
              )}
            />
          ))}
          {fields.length !== 5 && (
            <Button
              color='primary'
              onClick={() => append({ value: '' })}
              startContent={<Icon icon='solar:add-circle-bold' className='text-[20px]' />}
              isDisabled={!enabled}
            >
              追加
            </Button>
          )}
        </div>
      </FormLabelLayout>
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
