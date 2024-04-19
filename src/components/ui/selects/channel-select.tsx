'use client';

import type { GuildChannel } from '@/@types/discord';
import { Icon } from '@iconify-icon/react/dist/iconify.mjs';
import { Chip } from '@nextui-org/chip';
import { Select, SelectItem, type SelectProps, type SelectedItems } from '@nextui-org/select';
import { ChannelType } from 'discord-api-types/v10';
import React from 'react';

const channelTypeIcons = new Map<ChannelType, string>([
  [ChannelType.GuildAnnouncement, 'solar:mailbox-bold'],
  [ChannelType.AnnouncementThread, 'solar:hashtag-chat-bold'],
  [ChannelType.GuildCategory, 'solar:folder-2-bold'],
  [ChannelType.GuildForum, 'solar:chat-round-bold'],
  [ChannelType.GuildMedia, 'solar:gallery-minimalistic-bold'],
  [ChannelType.GuildStageVoice, 'solar:translation-2-bold'],
  [ChannelType.GuildText, 'solar:hashtag-bold'],
  [ChannelType.GuildVoice, 'solar:volume-loud-bold'],
  [ChannelType.PublicThread, 'solar:hashtag-chat-bold'],
  [ChannelType.PrivateThread, 'solar:hashtag-chat-bold'],
]);

type Props = {
  channels: GuildChannel[];
  types?: { allow?: ChannelType[]; ignore?: ChannelType[] };
  selectionMode?: keyof typeof ClassNames;
} & Omit<SelectProps, 'children' | 'renderValue' | 'items' | 'placeholder' | 'selectionMode'>;

const ClassNames = {
  multiple: {
    base: 'md:items-center md:justify-between md:max-w-sm',
    trigger: 'py-2',
  },
  single: {
    base: 'md:items-center md:justify-between md:max-w-xs',
  },
};

export const ChannelSelect = React.forwardRef<HTMLSelectElement, Props>(
  (
    { classNames, variant = 'bordered', channels, types, selectionMode = 'single', ...props },
    ref,
  ) => {
    const sortedChannels = channels
      .filter((channel) => (types?.allow ? types?.allow.includes(channel.type) : true))
      .filter((channel) => (types?.ignore ? !types?.ignore.includes(channel.type) : true))
      .sort((a, b) => a.position - b.position);

    const renderValue = (items: SelectedItems<GuildChannel>) => {
      return (
        <div className='flex flex-wrap items-center gap-1'>
          {items.map((item) =>
            selectionMode === 'multiple' ? (
              <MultipleSelectItem channel={item.data} key={item.key} />
            ) : (
              <SingleSelectItem channel={item.data} key={item.key} />
            ),
          )}
        </div>
      );
    };

    return (
      <Select
        ref={ref}
        classNames={classNames ?? ClassNames[selectionMode]}
        items={sortedChannels}
        variant={variant}
        placeholder='チャンネルを選択'
        renderValue={renderValue}
        selectionMode={selectionMode}
        isMultiline={selectionMode === 'multiple'}
        {...props}
      >
        {(channel) => (
          <SelectItem key={channel.id} value={channel.id} textValue={channel.name}>
            <SingleSelectItem channel={channel} />
          </SelectItem>
        )}
      </Select>
    );
  },
);

function SingleSelectItem({ channel }: { channel?: GuildChannel | null }) {
  return (
    <div className='flex items-center gap-2 text-default-500'>
      <Icon
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        icon={channelTypeIcons.get(channel?.type!) || 'solar:hashtag-chat-bold'}
        className='text-[18px]'
      />
      <span className='text-foreground'>{channel?.name}</span>
    </div>
  );
}

function MultipleSelectItem({ channel }: { channel?: GuildChannel | null }) {
  return <Chip>{channel?.name}</Chip>;
}
