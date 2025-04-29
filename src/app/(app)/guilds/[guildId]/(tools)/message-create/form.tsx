'use client';

import { FormCard } from '@/components/form';
import { Icon } from '@/components/icon';
import { ChannelSelect } from '@/components/react-hook-form/channel-select';
import { ControlledColorInput } from '@/components/react-hook-form/ui/color-input';
import { ControlledForm } from '@/components/react-hook-form/ui/form';
import { ControlledInput } from '@/components/react-hook-form/ui/input';
import { ControlledTabs } from '@/components/react-hook-form/ui/tabs';
import { ControlledTextarea } from '@/components/react-hook-form/ui/textarea';
import { messageOptions, snowflake } from '@/lib/database/src/utils/zod/discord';
import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tab,
  Tooltip,
} from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { type APIGuildChannel, ChannelType, type GuildChannelType } from 'discord-api-types/v10';
import { useParams } from 'next/navigation';
import { createContext, useContext } from 'react';
import {
  type UseFieldArrayReturn,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { z } from 'zod';

export const messageCreateFormSchema = z.object({
  channelId: snowflake,
  messageType: z.literal('legacy'),
  message: messageOptions,
});

type InputSchema = z.input<typeof messageCreateFormSchema>;
type OutputSchema = z.output<typeof messageCreateFormSchema>;

type Props = {
  channels: APIGuildChannel<GuildChannelType>[];
};

const PropsContext = createContext<Props>({
  channels: [],
});

export function MessageCreateForm({ channels }: Props) {
  const { guildId } = useParams<{ guildId: string }>();

  const form = useForm<InputSchema, object, OutputSchema>({
    resolver: zodResolver(messageCreateFormSchema),
    defaultValues: {
      message: {
        embeds: [],
      },
    },
  });

  return (
    <PropsContext value={{ channels }}>
      <ControlledForm form={form} onSubmit={form.handleSubmit(() => {})}>
        <GeneralSetting />
        <MessageSetting />
        {/* <FormDevTool /> */}
      </ControlledForm>
    </PropsContext>
  );
}

function GeneralSetting() {
  const { control } = useFormContext<InputSchema>();
  const { channels } = useContext(PropsContext);
  const channelId = useWatch<InputSchema>({ name: 'channelId' });

  return (
    <FormCard>
      <div className='flex gap-3 items-end'>
        <ChannelSelect
          control={control}
          name='channelId'
          channels={channels}
          channelTypeFilter={{
            include: [
              ChannelType.GuildText,
              ChannelType.GuildVoice,
              ChannelType.GuildAnnouncement,
              ChannelType.GuildStageVoice,
            ],
          }}
          selectionMode='single'
          label='メッセージを送信するチャンネル'
          isRequired
        />
        <div className='flex gap-3'>
          <Button
            size='lg'
            variant='flat'
            className='text-small'
            startContent={<Icon icon='solar:eye-bold' className='text-2xl' />}
          >
            プレビュー
          </Button>
          <Button
            type='submit'
            size='lg'
            color='primary'
            className='text-small'
            startContent={<Icon icon='solar:plain-bold' className='text-2xl' />}
            isDisabled={!channelId}
          >
            送信
          </Button>
        </div>
      </div>
    </FormCard>
  );
}

function MessageSetting() {
  const { control } = useFormContext<InputSchema>();

  return (
    <FormCard title='メッセージ' bodyClass='gap-0'>
      <ControlledTabs control={control} name='messageType'>
        <Tab
          key='legacy'
          title={
            <div className='flex items-center gap-2'>
              <Icon icon='solar:chat-round-bold' className='text-xl' />
              <span>メッセージ</span>
            </div>
          }
        >
          <div className='flex flex-col gap-4'>
            <LegacyMessageInput />
          </div>
        </Tab>
        <Tab
          key='components_v2'
          title={
            <div className='flex items-center gap-2'>
              <Icon icon='solar:magic-stick-3-bold' className='text-xl' />
              <span>コンポーネント v2</span>
            </div>
          }
          isDisabled
        />
      </ControlledTabs>
    </FormCard>
  );
}

function LegacyMessageInput() {
  const { control } = useFormContext<InputSchema>();
  const embedField = useFieldArray({ control, name: 'message.embeds' });

  return (
    <>
      <ControlledTextarea control={control} name='message.content' label='コンテンツ' minRows={4} />
      {embedField.fields.map((field, index) => (
        <LegacyMessageEmbedInput key={field.id} index={index} useFieldArrayReturn={embedField} />
      ))}
      <div className='flex gap-3'>
        <Dropdown>
          <DropdownTrigger>
            <Button
              color='primary'
              startContent={<Icon icon='solar:add-circle-bold' className='text-2xl' />}
              endContent={<Icon icon='solar:alt-arrow-down-outline' className='text-base' />}
            >
              要素を追加
            </Button>
          </DropdownTrigger>
          <DropdownMenu variant='flat'>
            <DropdownItem
              key='embed'
              onPress={() => embedField.append({ color: '#ffffff' })}
              startContent={
                <Icon icon='solar:chat-round-line-bold' className='text-2xl text-default-500' />
              }
            >
              埋め込み
            </DropdownItem>
            <DropdownItem
              key='component'
              description='ロール付与ボタン・セレクトメニュー、URLボタン'
              startContent={
                <Icon icon='solar:widget-2-bold' className='text-2xl text-default-500' />
              }
            >
              コンポーネント
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </>
  );
}

function LegacyMessageEmbedInput({
  index,
  useFieldArrayReturn: { remove, insert },
}: { index: number; useFieldArrayReturn: UseFieldArrayReturn<InputSchema, 'message.embeds'> }) {
  const { control, getValues } = useFormContext<InputSchema>();

  return (
    <Card className='flex flex-row w-full border-divider border-1.5 shadow-sm'>
      <LegacyMessageEmbedBorder index={index} />
      <div className='flex-1 flex flex-col'>
        <CardHeader className='p-5 pb-0 flex justify-between items-center gap-3'>
          <h3 className='text-lg font-semibold'>埋め込み #{index + 1}</h3>
          <div className='flex gap-2'>
            <Tooltip content='埋め込みを複製' delay={500}>
              <Button
                variant='flat'
                onPress={() => insert(index + 1, getValues(`message.embeds.${index}`))}
                isIconOnly
              >
                <Icon icon='solar:copy-bold' className='text-2xl' />
              </Button>
            </Tooltip>
            <Tooltip content='埋め込みを削除' delay={500}>
              <Button variant='flat' color='danger' onPress={() => remove(index)} isIconOnly>
                <Icon icon='solar:trash-bin-trash-bold' className='text-2xl' />
              </Button>
            </Tooltip>
          </div>
        </CardHeader>
        <CardBody className='p-5 pt-3 flex flex-col gap-8'>
          <Accordion
            itemClasses={{
              startContent: 'flex items-center text-default-500 text-2xl',
              content: 'px-4 pb-6 flex flex-col gap-3',
              title: 'text-small',
            }}
            selectionMode='multiple'
            defaultSelectedKeys={['body']}
          >
            <AccordionItem
              key='author'
              title='ヘッダー'
              startContent={<Icon icon='solar:user-bold' />}
            >
              <div className='flex max-sm:flex-col gap-3'>
                <ControlledInput
                  control={control}
                  name={`message.embeds.${index}.author.name`}
                  className='flex-1'
                  label='名前'
                />
                <ControlledInput
                  control={control}
                  name={`message.embeds.${index}.author.url`}
                  className='flex-1'
                  label='URL'
                />
              </div>
              <ControlledInput
                control={control}
                name={`message.embeds.${index}.author.icon_url`}
                label='アイコンの画像URL'
              />
            </AccordionItem>
            <AccordionItem
              key='body'
              title='コンテンツ'
              startContent={<Icon icon='solar:text-field-focus-bold' />}
            >
              <div className='flex max-sm:flex-col gap-3'>
                <ControlledInput
                  control={control}
                  name={`message.embeds.${index}.title`}
                  className='flex-1'
                  label='タイトル'
                />
                <ControlledInput
                  control={control}
                  name={`message.embeds.${index}.url`}
                  className='flex-1'
                  label='タイトルのURL'
                />
              </div>
              <ControlledTextarea
                control={control}
                name={`message.embeds.${index}.description`}
                label='メッセージ'
              />
              <ControlledColorInput
                control={control}
                name={`message.embeds.${index}.color`}
                label='カラーコード'
                isRequired
                showColorPicker
              />
            </AccordionItem>
            <AccordionItem
              key='fields'
              title='フィールド'
              startContent={<Icon icon='solar:list-bold' />}
            >
              a
            </AccordionItem>
            <AccordionItem
              key='images'
              title='画像'
              startContent={<Icon icon='solar:gallery-bold' />}
            >
              <ControlledInput
                control={control}
                name={`message.embeds.${index}.image.url`}
                label='画像URL'
                description='画像は埋め込みの下部に表示されます'
              />
              <ControlledInput
                control={control}
                name={`message.embeds.${index}.thumbnail.url`}
                label='サムネイルの画像URL'
                description='画像は埋め込みの右上に表示されます'
              />
            </AccordionItem>
            <AccordionItem
              key='footer'
              title='フッター'
              startContent={<Icon icon='solar:user-bold' />}
            >
              <ControlledInput
                control={control}
                name={`message.embeds.${index}.footer.text`}
                label='テキスト'
              />
              <ControlledInput
                control={control}
                name={`message.embeds.${index}.footer.icon_url`}
                label='アイコンの画像URL'
              />
            </AccordionItem>
          </Accordion>
        </CardBody>
      </div>
    </Card>
  );
}

function LegacyMessageEmbedBorder({ index }: { index: number }) {
  const color = useWatch<InputSchema>({
    name: `message.embeds.${index}.color`,
  });
  return <div className='h-auto w-2' style={{ backgroundColor: String(color) }} />;
}
