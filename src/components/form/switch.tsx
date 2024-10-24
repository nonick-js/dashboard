import { Switch, type SwitchProps } from '@nextui-org/switch';
import { cn } from '@nextui-org/theme';
import type React from 'react';
import {
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
  useController,
} from 'react-hook-form';

type ControlledSwitchBaseProps = {
  description?: string;
} & SwitchProps;

export function ControlledSwitch<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  description,
  children,
  ...props
}: ControlledSwitchBaseProps & UseControllerProps<TFieldValues, TName>) {
  const { field } = useController({ name, control });

  return (
    <div className='flex gap-1'>
      <Switch
        ref={field.ref}
        onChange={field.onChange}
        onBlur={field.onBlur}
        isSelected={field.value}
        {...props}
      />
      <div className='flex flex-col max-sm:gap-1'>
        <SwitchTitle>{children}</SwitchTitle>
        {description && <SwitchDescription>{description}</SwitchDescription>}
      </div>
    </div>
  );
}

function SwitchTitle({ className, ...props }: React.HTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('text-sm', className)} {...props} />;
}

function SwitchDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm max-sm:text-xs text-default-500', className)} {...props} />;
}
