import { Icon } from '@iconify-icon/react';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';

export function ToolbarMockup() {
  return (
    <div className='flex flex-col sm:flex-row gap-3'>
      <Input
        size='md'
        startContent={
          <Icon icon='solar:magnifer-outline' className='text-[20px]' />
        }
        placeholder='名前またはサーバーIDで検索'
        isDisabled
      />
      <div>
        <Button
          className='rounded-lg w-full sm:w-auto'
          startContent={
            <Icon icon='solar:add-circle-bold' className='text-[20px]' />
          }
          color='primary'
          isDisabled
        >
          サーバーに導入
        </Button>
      </div>
    </div>
  );
}
