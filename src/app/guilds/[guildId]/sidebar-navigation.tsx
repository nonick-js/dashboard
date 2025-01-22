'use client';

import { Icon } from '@/components/icon';
import { Accordion, AccordionItem } from '@heroui/accordion';
import {
  Listbox,
  ListboxItem,
  type ListboxProps,
  ListboxSection,
  type ListboxSectionProps,
} from '@heroui/listbox';
import { cn } from '@heroui/theme';
import { Tooltip } from '@heroui/tooltip';
import type { Selection } from '@react-types/shared';
import { useParams } from 'next/navigation';
import React from 'react';

export enum SidebarItemType {
  Nest = 'nest',
}

export type SidebarItem = {
  key: string;
  title: string;
  icon?: string;
  href?: string | ((guildId: string) => string);
  type?: SidebarItemType.Nest;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  items?: SidebarItem[];
  className?: string;
};

export type SidebarProps = Omit<ListboxProps<SidebarItem>, 'children'> & {
  items: SidebarItem[];
  isCompact?: boolean;
  hideEndContent?: boolean;
  iconClassName?: string;
  sectionClasses?: ListboxSectionProps['classNames'];
  classNames?: ListboxProps['classNames'];
  defaultSelectedKey: string;
  onSelect?: (key: string) => void;
};

export function SidebarNavigation({
  ref,
  items,
  isCompact,
  defaultSelectedKey,
  onSelect,
  hideEndContent,
  sectionClasses: sectionClassesProp = {},
  itemClasses: itemClassesProp = {},
  iconClassName,
  classNames,
  className,
  ...props
}: SidebarProps) {
  const [selected, setSelected] = React.useState<React.Key>(defaultSelectedKey);
  const params = useParams<{ guildId: string }>();

  const sectionClasses = {
    ...sectionClassesProp,
    base: cn(sectionClassesProp?.base, 'w-full', {
      'p-0 max-w-[44px]': isCompact,
    }),
    group: cn(sectionClassesProp?.group, {
      'flex flex-col gap-1': isCompact,
    }),
    heading: cn(sectionClassesProp?.heading, {
      hidden: isCompact,
    }),
  };

  const itemClasses = {
    ...itemClassesProp,
    base: cn(itemClassesProp?.base, {
      'w-11 h-11 gap-0 p-0': isCompact,
    }),
  };

  const renderNestItem = React.useCallback(
    (item: SidebarItem) => {
      const isNestType =
        item.items && item.items?.length > 0 && item?.type === SidebarItemType.Nest;

      if (isNestType) {
        // Is a nest type item , so we need to remove the href
        item.href = undefined;
      }

      return (
        <ListboxItem
          {...item}
          href={typeof item.href === 'function' ? item.href(params.guildId) : item.href}
          key={item.key}
          classNames={{
            base: cn(
              {
                'h-auto p-0': !isCompact && isNestType,
              },
              {
                'inline-block w-11': isCompact && isNestType,
              },
            ),
          }}
          endContent={isCompact || isNestType || hideEndContent ? null : (item.endContent ?? null)}
          startContent={
            isCompact || isNestType ? null : item.icon ? (
              <Icon
                className={cn(
                  'text-default-500 group-data-[selected=true]:text-foreground',
                  iconClassName,
                )}
                icon={item.icon}
                width={24}
              />
            ) : (
              (item.startContent ?? null)
            )
          }
          title={isCompact || isNestType ? null : item.title}
        >
          {isCompact ? (
            <Tooltip content={item.title} placement='right'>
              <div className='flex w-full items-center justify-center'>
                {item.icon ? (
                  <Icon
                    className={cn(
                      'text-default-500 group-data-[selected=true]:text-foreground',
                      iconClassName,
                    )}
                    icon={item.icon}
                    width={24}
                  />
                ) : (
                  (item.startContent ?? null)
                )}
              </div>
            </Tooltip>
          ) : null}
          {!isCompact && isNestType ? (
            <Accordion className={'p-0'}>
              <AccordionItem
                key={item.key}
                aria-label={item.title}
                classNames={{
                  heading: 'pr-3',
                  trigger: 'p-0',
                  content: 'py-0 pl-4',
                }}
                title={
                  item.icon ? (
                    <div className={'flex h-11 items-center gap-2 px-2 py-1.5'}>
                      <Icon
                        className={cn(
                          'text-default-500 group-data-[selected=true]:text-foreground',
                          iconClassName,
                        )}
                        icon={item.icon}
                        width={24}
                      />
                      <span className='text-small font-medium text-foreground group-data-[selected=true]:text-foreground'>
                        {item.title}
                      </span>
                    </div>
                  ) : (
                    (item.startContent ?? null)
                  )
                }
              >
                {item.items && item.items?.length > 0 ? (
                  <Listbox
                    className={'mt-0.5'}
                    classNames={{
                      list: cn('border-l border-default-200 pl-4'),
                    }}
                    items={item.items}
                    variant='flat'
                  >
                    {item.items.map(renderItem)}
                  </Listbox>
                ) : (
                  renderItem(item)
                )}
              </AccordionItem>
            </Accordion>
          ) : null}
        </ListboxItem>
      );
    },
    [isCompact, hideEndContent, iconClassName, params.guildId],
  );

  const renderItem = React.useCallback(
    (item: SidebarItem) => {
      const isNestType =
        item.items && item.items?.length > 0 && item?.type === SidebarItemType.Nest;

      if (isNestType) {
        return renderNestItem(item);
      }

      return (
        <ListboxItem
          {...item}
          href={typeof item.href === 'function' ? item.href(params.guildId) : item.href}
          key={item.key}
          endContent={isCompact || hideEndContent ? null : (item.endContent ?? null)}
          startContent={
            isCompact ? null : item.icon ? (
              <Icon
                className={cn(
                  'text-default-500 group-data-[selected=true]:text-foreground',
                  iconClassName,
                )}
                icon={item.icon}
                width={24}
              />
            ) : (
              (item.startContent ?? null)
            )
          }
          textValue={item.title}
          title={isCompact ? null : item.title}
        >
          {isCompact ? (
            <Tooltip content={item.title} placement='right'>
              <div className='flex w-full items-center justify-center'>
                {item.icon ? (
                  <Icon
                    className={cn(
                      'text-default-500 group-data-[selected=true]:text-foreground',
                      iconClassName,
                    )}
                    icon={item.icon}
                    width={24}
                  />
                ) : (
                  (item.startContent ?? null)
                )}
              </div>
            </Tooltip>
          ) : null}
        </ListboxItem>
      );
    },
    [isCompact, hideEndContent, iconClassName, params.guildId, renderNestItem],
  );

  return (
    <Listbox
      key={isCompact ? 'compact' : 'default'}
      ref={ref}
      hideSelectedIcon
      as='nav'
      className={cn('list-none', className)}
      classNames={{
        ...classNames,
        list: cn('items-center', classNames?.list),
      }}
      color='default'
      itemClasses={{
        ...itemClasses,
        base: cn(
          'px-3 min-h-11 rounded-large h-[44px] data-[selected=true]:bg-default-100',
          itemClasses?.base,
        ),
        title: cn(
          'text-small font-medium text-default-500 group-data-[selected=true]:text-foreground',
          itemClasses?.title,
        ),
      }}
      items={items}
      selectedKeys={[selected] as unknown as Selection}
      selectionMode='single'
      variant='flat'
      aria-label='Navigation Listbox'
      onSelectionChange={(keys) => {
        const key = Array.from(keys)[0];

        setSelected(key as React.Key);
        onSelect?.(key as string);
      }}
      {...props}
    >
      {(item) => {
        return item.items && item.items?.length > 0 && item?.type === SidebarItemType.Nest ? (
          renderNestItem(item)
        ) : item.items && item.items?.length > 0 ? (
          <ListboxSection
            key={item.key}
            classNames={{
              ...sectionClasses,
              group: cn('space-y-0.5', sectionClasses.group),
            }}
            showDivider={isCompact}
            title={item.title}
          >
            {item.items.map(renderItem)}
          </ListboxSection>
        ) : (
          renderItem(item)
        );
      }}
    </Listbox>
  );
}
