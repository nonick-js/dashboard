'use client';

import { DevTool } from '@hookform/devtools';
import { useFormContext } from 'react-hook-form';

export function FormDevTool() {
  const form = useFormContext();
  return <DevTool control={form.control} placement='top-left' />;
}
