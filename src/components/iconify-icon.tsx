'use client';

import { Icon as IconifyIcon, type IconifyIconProps } from '@iconify-icon/react';

export function Icon(props: Omit<IconifyIconProps, 'ref'>) {
  return <IconifyIcon {...props} />;
}
