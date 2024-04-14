import { Spinner } from '@nextui-org/spinner';

export default function LoadingPage() {
  return (
    <div className='flex w-full justify-center items-center'>
      <Spinner color='primary' size='md' />
    </div>
  );
}
