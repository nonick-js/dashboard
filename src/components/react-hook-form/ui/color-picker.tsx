import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import {
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
  useController,
} from 'react-hook-form';
import { useDebouncyEffect } from 'use-debouncy';

const numberToHex = (n: number): string => `#${n.toString(16).padStart(6, '0')}`;
const hexToNumber = (hex: string): number => Number.parseInt(hex.replace('#', ''), 16);

export function ControlledHexColorPicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ control, name }: UseControllerProps<TFieldValues, TName>) {
  const { field } = useController({ name, control });

  const initialHex = numberToHex(field.value ?? 0);
  const [hexColor, setHexColor] = useState<string>(initialHex);

  useDebouncyEffect(
    () => {
      const numeric = hexToNumber(hexColor);
      field.onChange(numeric);
    },
    100,
    [hexColor],
  );

  return (
    <HexColorPicker
      color={numberToHex(field.value ?? 0)}
      onChange={(newHex) => setHexColor(newHex)}
    />
  );
}
