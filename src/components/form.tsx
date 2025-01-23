import { Card, CardBody, CardHeader } from '@heroui/card';
import { cn } from '@heroui/theme';
import type { ReactNode } from 'react';

export type FormCardProps = {
  title?: ReactNode;
  headerClass?: string;
  bodyClass?: string;
  children: ReactNode;
};

export function FormCard({ title, headerClass, bodyClass, children }: FormCardProps) {
  return (
    <Card className='w-full'>
      {title && (
        <CardHeader className={cn('p-6', headerClass)}>
          <h3 className='text-lg font-semibold'>{title}</h3>
        </CardHeader>
      )}
      <CardBody className={cn('flex flex-col gap-8 p-6', { 'pt-0': title }, bodyClass)}>
        {children}
      </CardBody>
    </Card>
  );
}
