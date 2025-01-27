﻿'use client';

import { type TextAreaProps, Textarea } from '@heroui/input';
import { cn } from '@heroui/theme';
import {
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
  useController,
} from 'react-hook-form';

export type ControlledTextareaProps = { maxArrayLength?: number } & Omit<
  TextAreaProps,
  'ref' | 'onChange' | 'onValueChange' | 'value' | 'isInvalid' | 'errorMessage'
>;

export function ControlledArrayTextarea<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  classNames,
  maxArrayLength,
  labelPlacement = 'outside',
  ...props
}: ControlledTextareaProps & UseControllerProps<TFieldValues, TName>) {
  const { field, fieldState } = useController({ name, control });

  return (
    <Textarea
      // React Hook Form
      ref={field.ref}
      onValueChange={field.onChange}
      onBlur={field.onBlur}
      value={Array.isArray(field.value) ? field.value.join(', ') : field.value}
      isInvalid={fieldState.invalid}
      errorMessage={fieldState.error?.message}
      // Other
      classNames={{
        ...classNames,
        label: cn('text-sm', classNames?.label),
        description: cn('text-sm text-default-500 max-sm:text-xs', classNames?.description),
        errorMessage: cn('text-sm max-sm:text-xs', classNames?.errorMessage),
        innerWrapper: cn('flex-col items-end', classNames?.innerWrapper),
      }}
      endContent={
        maxArrayLength && (
          <span
            className={cn('text-default-500 ml-auto text-sm group-data-[invalid=true]:text-danger')}
          >
            {
              String(field.value)
                .split(/,|\n/)
                .map((v) => v.trim())
                .filter((v) => !!v).length
            }
            /{maxArrayLength}
          </span>
        )
      }
      labelPlacement={labelPlacement}
      {...props}
    />
  );
}
