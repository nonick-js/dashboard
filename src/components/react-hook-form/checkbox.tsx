'use client';

import { CheckboxGroup, type CheckboxGroupProps } from '@heroui/checkbox';
import { cn } from '@heroui/theme';
import {
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
  useController,
} from 'react-hook-form';

export type ControlledCheckboxGroupProps = Omit<
  CheckboxGroupProps,
  'ref' | 'onChange' | 'onBlur' | 'value' | 'isInvalid' | 'errorMessage'
>;

export function ControlledCheckboxGroup<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  classNames,
  ...props
}: ControlledCheckboxGroupProps & UseControllerProps<TFieldValues, TName>) {
  const { field, fieldState } = useController({ name, control });

  return (
    <CheckboxGroup
      // React Hook Form
      ref={field.ref}
      onValueChange={field.onChange}
      onBlur={field.onBlur}
      value={Array.isArray(field.value) ? field.value.map((v: unknown) => String(v)) : []}
      isInvalid={fieldState.invalid}
      errorMessage={fieldState.error?.message}
      // Other
      classNames={{
        ...classNames,
        label: cn(
          'text-foreground text-sm',
          { 'opacity-disabled': props.isDisabled },
          classNames?.label,
        ),
        description: cn('text-sm max-sm:text-xs', classNames?.description),
      }}
      {...props}
    />
  );
}
