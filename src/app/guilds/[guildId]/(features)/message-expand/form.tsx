'use client';

import { FormCard } from '@/components/form';
import { Icon } from '@/components/icon';
import { FormChangePublisher } from '@/components/react-hook-form/change-publisher';
import { ChannelSelect } from '@/components/react-hook-form/channel-select';
import { ControlledCheckboxGroup } from '@/components/react-hook-form/ui/checkbox';
import { ControlledForm } from '@/components/react-hook-form/ui/form';
import { ControlledSelect } from '@/components/react-hook-form/ui/select';
import { ControlledSwitch } from '@/components/react-hook-form/ui/switch';
import { MessageExpandIgnorePrefixes, MessageExpandZodSchema } from '@/lib/database/zod';
import type { getChannels } from '@/lib/discord';
import { convertNumbersToStrings } from '@/lib/utils';
import { Checkbox, type CheckboxProps } from '@heroui/checkbox';
import { Chip } from '@heroui/chip';
import { SelectItem } from '@heroui/select';
import { cn } from '@heroui/theme';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChannelType } from 'discord-api-types/v10';
import { useParams } from 'next/navigation';
import { createContext, useContext } from 'react';
import { type SubmitHandler, useForm, useFormContext, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import type { z } from 'zod';
import { updateSetting } from './action';

// #region Types, Context
type InputSetting = z.input<typeof MessageExpandZodSchema>;
type OutputSetting = z.output<typeof MessageExpandZodSchema>;

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
    resolver: zodResolver(MessageExpandZodSchema),
    defaultValues: setting
      ? convertNumbersToStrings(setting)
      : {
          enabled: false,
          allowExternalGuild: false,
          ignore: {
            channels: [],
            types: [],
            prefixes: [],
          },
        },
  });

  const onSubmit: SubmitHandler<OutputSetting> = async (values) => {
    const res = await updateSetting({ guildId, ...values });

    if (res?.data?.success) form.reset(form.getValues());
    else toast.error('設定の保存時に問題が発生しました。');
  };

  return (
    <PropsContext.Provider value={props}>
      <ControlledForm form={form} onSubmit={form.handleSubmit(onSubmit)}>
        <EnableSetting />
        <GeneralSetting />
        <IgnoreSetting />
        <FormChangePublisher />
      </ControlledForm>
    </PropsContext.Provider>
  );
}

function EnableSetting() {
  const { control } = useFormContext<InputSetting>();

  return (
    <FormCard>
      <ControlledSwitch control={control} name='enabled' label='メッセージURL展開を有効にする' />
    </FormCard>
  );
}

function GeneralSetting() {
  const { control } = useFormContext<InputSetting>();

  const isEnabled = useWatch<InputSetting>({ name: 'enabled' });

  return (
    <FormCard title='全般設定'>
      <ControlledSwitch
        control={control}
        name='allowExternalGuild'
        label='このサーバーのメッセージを他のサーバーで展開することを許可する'
        description='有効にすると、このサーバーのメッセージURLが他のサーバーでも展開されるようになります。'
        isDisabled={!isEnabled}
      />
    </FormCard>
  );
}

function IgnoreSetting() {
  const { control } = useFormContext<InputSetting>();
  const { channels } = useContext(PropsContext);

  const isEnabled = useWatch<InputSetting>({ name: 'enabled' });

  return (
    <FormCard title='例外設定'>
      <ControlledCheckboxGroup
        control={control}
        name='ignore.types'
        label='URLを展開しないチャンネルの種類'
        description='特定の種類のチャンネルでURLが展開されないようにします。'
        isDisabled={!isEnabled}
      >
        <CustomCheckbox icon='solar:mailbox-bold' value={String(ChannelType.GuildAnnouncement)}>
          アナウンスチャンネル
        </CustomCheckbox>
        <CustomCheckbox icon='solar:volume-loud-bold' value={String(ChannelType.GuildVoice)}>
          ボイスチャンネル
        </CustomCheckbox>
        <CustomCheckbox icon='solar:hashtag-chat-bold' value={String(ChannelType.PublicThread)}>
          公開スレッド
        </CustomCheckbox>
        <CustomCheckbox icon='solar:hashtag-chat-bold' value={String(ChannelType.PrivateThread)}>
          プライベートスレッド
        </CustomCheckbox>
      </ControlledCheckboxGroup>
      <ChannelSelect
        control={control}
        name='ignore.channels'
        channels={channels}
        channelTypeFilter={{ exclude: [ChannelType.GuildCategory] }}
        label='URLを展開しないチャンネル'
        description='この設定は指定したチャンネルのスレッドにも適用されます。'
        selectionMode='multiple'
        isDisabled={!isEnabled}
      />
      <ControlledSelect
        control={control}
        name='ignore.prefixes'
        label='プレフィックスを選択'
        description='URLの前にこれらの記号がある場合に展開が行われないようにします。（5つまで選択可）'
        items={MessageExpandIgnorePrefixes.map((prefix) => ({ value: prefix }))}
        renderValue={(items) => (
          <div className='flex flex-wrap items-center gap-1'>
            {items.map((item) => (
              <Chip key={item.key}>
                <span className='px-0.5'>{item.data?.value}</span>
              </Chip>
            ))}
          </div>
        )}
        placeholder='プレフィックスを選択'
        selectionMode='multiple'
        isDisabled={!isEnabled}
      >
        {(prefix) => <SelectItem key={prefix.value}>{prefix.value}</SelectItem>}
      </ControlledSelect>
    </FormCard>
  );
}
// #endregion

// #region Components
type CustomCheckboxProps = CheckboxProps & { icon: string };

function CustomCheckbox({ children, icon, ...props }: CustomCheckboxProps) {
  return (
    <Checkbox
      classNames={{
        base: cn(
          'inline-flex m-0 bg-default-100 items-center justify-between w-full max-w-none',
          'w-full cursor-pointer rounded-lg gap-2 px-4 py-3 border-2 border-transparent data-[hover=true]:bg-opacity-70 transition-background',
        ),
        label: 'w-full',
      }}
      {...props}
    >
      <div className='flex items-center gap-3 text-sm'>
        <Icon className='text-default-500' icon={icon} width={20} height={20} />
        {children}
      </div>
    </Checkbox>
  );
}
// #endregion
