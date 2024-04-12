import { Spinner } from '@nextui-org/spinner';
import { ToolbarMockup } from './toolbar-mockup';

export default function LoadingPage() {
  return (
    <div className='py-6 flex flex-col gap-6'>
      <ToolbarMockup />
      <Spinner color='primary' size='md' />
    </div>
  );
}
