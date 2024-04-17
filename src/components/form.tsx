'use client';

import { Button } from '@nextui-org/button';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { cn } from '@nextui-org/react';
import type { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

export function CardTitle({ children }: { children: ReactNode }) {
  return <h3 className='text-lg font-semibold leading-none tracking-tight'>{children}</h3>;
}

export function FormCard({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <Card>
      {title && (
        <CardHeader className='p-6'>
          <h3 className='text-lg font-semibold leading-none tracking-tight'>{title}</h3>
        </CardHeader>
      )}
      <CardBody className={cn('flex flex-col gap-6 p-6', { 'pt-0': title })}>{children}</CardBody>
    </Card>
  );
}

export function SwitchLabel({ title, description }: { title: string; description?: string }) {
  return (
    <div className={cn({ 'flex flex-col max-sm:gap-1': description })}>
      <p>{title}</p>
      {description && <p className='max-sm:text-xs text-default-500'>{description}</p>}
    </div>
  );
}

export function SubmitButton() {
  const { formState } = useFormContext();

  return (
    <div className='flex items-center gap-3 w-full pb-12'>
      <Button
        color='primary'
        type='submit'
        isLoading={formState.isSubmitting}
        isDisabled={!formState.isDirty}
      >
        変更を保存
      </Button>
    </div>
  );
}

export function FormValueViewer() {
  if (!process.env.NEXT_PUBLIC_DEV_MODE) return null;

  const form = useFormContext();
  return <pre>{JSON.stringify(form.watch(), null, 2)}</pre>;
}

export const FormSwitchClassNames = {
  base: 'max-w-none flex-row-reverse justify-between gap-3',
  label: 'text-sm',
};

export const FormSelectClassNames = {
  multiple: { trigger: 'min-h-unit-12 py-2' },
  single: {
    base: 'md:items-center md:justify-between',
    mainWrapper: 'md:max-w-xs',
  },
};
