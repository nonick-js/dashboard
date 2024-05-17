'use client';

import { Icon } from '@iconify-icon/react/dist/iconify.mjs';
import { cn } from '@nextui-org/react';
import { type VariantProps, cva } from 'class-variance-authority';
import React from 'react';

const alertVariants = cva('flex gap-3 items-center px-4 py-3 rounded-lg', {
  variants: {
    variant: {
      info: '[&>iconify-icon]:text-primary bg-primary/20',
      success: '[&>iconify-icon]:text-success bg-success/20',
      warning: '[&>iconify-icon]:text-warning bg-warning/20',
      danger: '[&>iconify-icon]:text-danger bg-danger/20',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
});

const Icons = new Map([
  ['info', 'solar:info-circle-bold'],
  ['success', 'solar:check-circle-bold'],
  ['warning', 'solar:danger-circle-bold'],
  ['danger', 'solar:close-circle-bold'],
]);

type AlertProps = {
  title: string;
  description?: string;
} & VariantProps<typeof alertVariants>;

const Alert = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & AlertProps>(
  ({ className, variant, title, description, ...props }, ref) => (
    <div ref={ref} role='alert' className={cn(alertVariants({ variant }), className)} {...props}>
      <Icon
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        icon={Icons.get(variant!) || 'solar:info-circle-bold'}
        className='text-[22px]'
      />
      <div>
        <AlertTitle>{title}</AlertTitle>
        {description && <AlertDescription>{description}</AlertDescription>}
      </div>
    </div>
  ),
);

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('text-sm font-medium leading-none tracking-tight', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-default-500', className)} {...props} />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert };
