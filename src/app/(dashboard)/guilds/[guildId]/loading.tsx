import { CircularProgress } from '@nextui-org/progress';

export default function LoadingPage() {
  return (
    <div className='flex w-full justify-center items-center'>
      <CircularProgress color='primary' size='md' />
    </div>
  );
}
