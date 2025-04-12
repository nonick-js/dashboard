﻿'use client';

import { Spinner } from '@heroui/spinner';

export default function Loading() {
  return (
    <div className='flex items-center justify-center w-full h-[calc(100dvh_-_80px)]'>
      <Spinner variant='spinner' className='mb-[80px]' />
    </div>
  );
}
