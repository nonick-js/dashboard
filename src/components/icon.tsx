'use client';

import { type IconProps, Icon as RealIcon } from '@iconify/react';

export function Icon(props: IconProps) {
  return (
    <span
      style={{
        width: props.width || 20,
        height: props.width || 20,
      }}
    >
      <RealIcon {...props} />
    </span>
  );
}
