import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import {
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
  useController,
} from 'react-hook-form';
import { useDebouncyEffect } from 'use-debouncy';

export function ControlledHexColorPicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ control, name }: UseControllerProps<TFieldValues, TName>) {
  const { field } = useController({ name, control });
  const [color, setColor] = useState<string>(field.value);

  useDebouncyEffect(() => field.onChange(color), 100, [color]);

  return <HexColorPicker color={field.value} onChange={(newColor) => setColor(newColor)} />;
}
