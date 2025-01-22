'use client';

import { Toaster as Sonner } from 'sonner';
import { Icon } from './icon';

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      toastOptions={{
        classNames: {
          icon: 'text-[20px]',
        },
      }}
      icons={{
        info: (
          <Icon icon='solar:info-circle-bold' className='text-primary' width={20} height={20} />
        ),
        success: (
          <Icon icon='solar:check-circle-bold' className='text-success' width={20} height={20} />
        ),
        warning: (
          <Icon icon='solar:danger-circle-bold' className='text-warning' width={20} height={20} />
        ),
        error: (
          <Icon icon='solar:close-circle-bold' className='text-danger' width={20} height={20} />
        ),
      }}
      {...props}
    />
  );
}
