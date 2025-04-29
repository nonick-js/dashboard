'use client';

import { Tabs, type TabsProps } from '@heroui/react';
import {
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
  useController,
} from 'react-hook-form';

export type ControlledTabsProps = Omit<
  TabsProps,
  'ref' | 'onChange' | 'onValueChange' | 'value' | 'isInvalid' | 'errorMessage'
>;

export function ControlledTabs<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  classNames,
  ...props
}: ControlledTabsProps & UseControllerProps<TFieldValues, TName>) {
  const { field } = useController({ name, control });

  return (
    <Tabs
      // React Hook Form
      ref={field.ref}
      onSelectionChange={field.onChange}
      onBlur={field.onBlur}
      selectedKey={field.value}
      // Other
      {...props}
    />
  );
}
