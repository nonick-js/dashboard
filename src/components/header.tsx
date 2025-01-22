import { cn } from '@heroui/theme';
import type React from 'react';
import type { HTMLAttributes } from 'react';

export function Header({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1', className)} {...props} />;
}

export function HeaderTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1 className={cn('text-2xl sm:text-3xl font-extrabold sm:font-black', className)} {...props} />
  );
}

export function HeaderDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-small sm:text-medium text-default-500 leading-tight', className)}
      {...props}
    />
  );
}
