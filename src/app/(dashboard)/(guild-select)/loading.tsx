import { CircularProgress } from '@nextui-org/progress';
import { ToolbarMockup } from './toolbar-mockup';

export default function LoadingPage() {
  return (
    <div className='py-6 flex flex-col gap-6'>
      <ToolbarMockup />
      <div className='flex w-full justify-center items-center'>
        <CircularProgress color='primary' size='md' />
      </div>
    </div>
  );
}
