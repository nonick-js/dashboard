import { CircularProgress } from '@heroui/progress';

export default function Loading() {
  return (
    <div className='flex items-center justify-center w-full h-[calc(100dvh_-_80px)]'>
      <CircularProgress className='mb-[80px]' aria-label='Loading...' size='md' />
    </div>
  );
}
