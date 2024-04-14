'use client';

import { FormSelectClassNames } from '@/components/form';
import { Chip } from '@nextui-org/chip';
import {
  Select,
  SelectItem,
  type SelectProps,
  type SelectedItems,
} from '@nextui-org/select';
import type { APIRole } from 'discord-api-types/v10';

export type Props = {
  roles: APIRole[];
  filter?: (role: APIRole) => boolean;
  selectionMode?: keyof typeof FormSelectClassNames;
} & Omit<
  SelectProps,
  'children' | 'renderValue' | 'items' | 'placeholder' | 'selectionMode'
>;

export function RoleSelect({
  classNames,
  roles,
  filter,
  isRequired,
  selectionMode = 'single',
  ...props
}: Props) {
  const sortedRoles = roles
    .filter((role) => (filter ? filter(role) : true))
    .sort((a, b) => (a.position < b.position ? 1 : -1));

  function renderValue(items: SelectedItems<APIRole>) {
    return (
      <div className='flex flex-wrap gap-1'>
        {items.map((item) =>
          selectionMode === 'multiple' ? (
            <MultipleSelectItem role={item.data} key={item.key} />
          ) : (
            <SingleSelectItem role={item.data} key={item.key} />
          ),
        )}
      </div>
    );
  }

  return (
    <Select
      classNames={classNames ?? FormSelectClassNames[selectionMode]}
      items={sortedRoles}
      variant='bordered'
      placeholder='ロールを選択'
      renderValue={renderValue}
      selectionMode={selectionMode}
      isMultiline={selectionMode === 'multiple'}
      isRequired={isRequired}
      disallowEmptySelection={isRequired}
      {...props}
    >
      {(role) => (
        <SelectItem key={role.id} value={role.id} textValue={role.name}>
          <SingleSelectItem role={role} />
        </SelectItem>
      )}
    </Select>
  );
}

function SingleSelectItem({ role }: { role?: APIRole | null }) {
  return (
    <div className='flex items-center gap-2'>
      <div className='flex size-[18px] items-center justify-center'>
        <div
          className='h-2 w-2 rounded-full'
          style={{
            backgroundColor: role?.color
              ? `#${role.color.toString(16)}`
              : 'GrayText',
          }}
        />
      </div>
      <span className='text-foreground'>{role?.name}</span>
    </div>
  );
}

function MultipleSelectItem({ role }: { role?: APIRole | null }) {
  return <Chip>{role?.name}</Chip>;
}
