import { CircularProgress } from '@heroui/progress';

export default function Loading() {
  return (
    <div className='flex items-center justify-center w-full h-dvh mt-[-80px]'>
      <CircularProgress aria-label='Loading...' size='md' />
    </div>
  );
}
