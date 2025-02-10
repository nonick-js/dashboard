import { type InputProps, useInput } from '@heroui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/popover';
import { CloseFilledIcon } from '@heroui/shared-icons';
import { cn } from '@heroui/theme';
import { useMemo } from 'react';
import { HexColorInput } from 'react-colorful';
import {
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
  useController,
} from 'react-hook-form';
import { ControlledHexColorPicker } from './color-picker';

export type ControlledColorInputProps = {
  showColorPicker?: boolean;
} & Omit<InputProps, 'ref' | 'onChange' | 'onValueChange' | 'value' | 'isInvalid' | 'errorMessage'>;

export function ControlledColorInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  variant = 'flat',
  classNames,
  ...props
}: ControlledColorInputProps & UseControllerProps<TFieldValues, TName>) {
  const { field, fieldState } = useController({ name, control });

  const {
    Component,
    label,
    description,
    isClearable,
    startContent,
    endContent,
    labelPlacement,
    hasHelper,
    isOutsideLeft,
    shouldLabelBeOutside,
    errorMessage,
    isInvalid,
    getBaseProps,
    getLabelProps,
    getInputProps,
    getInnerWrapperProps,
    getInputWrapperProps,
    getMainWrapperProps,
    getHelperWrapperProps,
    getDescriptionProps,
    getErrorMessageProps,
    getClearButtonProps,
  } = useInput({
    // React Hook Form
    ref: field.ref,
    onBlur: field.onBlur,
    isInvalid: fieldState.invalid,
    errorMessage: fieldState.error?.message,
    // Other
    classNames: {
      ...classNames,
      label: cn('text-sm', classNames?.label),
      description: cn('text-sm max-sm:text-xs', classNames?.description),
      errorMessage: cn('text-sm max-sm:text-xs', classNames?.errorMessage),
      inputWrapper: cn({
        'data-[hover=true]:bg-opacity-30 transition-background': variant === 'flat',
      }),
    },
    endContent: props.showColorPicker && (
      <Popover showArrow>
        <PopoverTrigger>
          <button
            type='button'
            className='h-full aspect-square flex-shrink-0 rounded-full border-divider border-2'
            style={{ backgroundColor: field.value }}
          />
        </PopoverTrigger>
        <PopoverContent className='p-4'>
          <ControlledHexColorPicker control={control} name={name} />
        </PopoverContent>
      </Popover>
    ),
    variant,
    ...props,
  });

  // biome-ignore lint/a11y/noLabelWithoutControl: <explanation>
  const labelContent = label ? <label {...getLabelProps()}>{label}</label> : null;

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const end = useMemo(() => {
    if (isClearable) {
      return <button {...getClearButtonProps()}>{endContent || <CloseFilledIcon />}</button>;
    }

    return endContent;
  }, [isClearable, getClearButtonProps]);

  const helperWrapper = useMemo(() => {
    const shouldShowError = isInvalid && errorMessage;
    const hasContent = shouldShowError || description;

    if (!hasHelper || !hasContent) return null;

    return (
      <div {...getHelperWrapperProps()}>
        {shouldShowError ? (
          <div {...getErrorMessageProps()}>{errorMessage}</div>
        ) : (
          <div {...getDescriptionProps()}>{description}</div>
        )}
      </div>
    );
  }, [
    hasHelper,
    isInvalid,
    errorMessage,
    description,
    getHelperWrapperProps,
    getErrorMessageProps,
    getDescriptionProps,
  ]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const innerWrapper = useMemo(() => {
    return (
      <div {...getInnerWrapperProps()}>
        {startContent}
        <HexColorInput
          {...getInputProps()}
          onChange={(newColor) => field.onChange(newColor)}
          color={field.value}
        />
        {end}
      </div>
    );
  }, [startContent, end, getInputProps, getInnerWrapperProps]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const mainWrapper = useMemo(() => {
    if (shouldLabelBeOutside) {
      return (
        <div {...getMainWrapperProps()}>
          <div {...getInputWrapperProps()}>
            {!isOutsideLeft ? labelContent : null}
            {innerWrapper}
          </div>
          {helperWrapper}
        </div>
      );
    }

    return (
      <>
        <div {...getInputWrapperProps()}>
          {labelContent}
          {innerWrapper}
        </div>
        {helperWrapper}
      </>
    );
  }, [
    labelPlacement,
    helperWrapper,
    shouldLabelBeOutside,
    labelContent,
    innerWrapper,
    errorMessage,
    description,
    getMainWrapperProps,
    getInputWrapperProps,
    getErrorMessageProps,
    getDescriptionProps,
  ]);

  return (
    <div className='flex gap-3'>
      <Component {...getBaseProps()}>
        {isOutsideLeft ? labelContent : null}
        {mainWrapper}
      </Component>
    </div>
  );
}
