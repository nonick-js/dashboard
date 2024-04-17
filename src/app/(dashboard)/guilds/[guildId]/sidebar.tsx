import { ScrollShadow } from '@nextui-org/scroll-shadow';
import { getMutualGuilds } from '../../mutualGuilds';
import { SidebarGuildSelect } from './sidebar-guild-select';
import { SidebarNavigation } from './sidebar-navigation';

export async function Sidebar() {
  const mutualGuilds = await getMutualGuilds();

  return (
    <ScrollShadow className='w-[280px] max-md:hidden' hideScrollBar>
      <div className='flex flex-col gap-4'>
        <SidebarGuildSelect mutualGuilds={mutualGuilds} />
        <SidebarNavigation />
      </div>
    </ScrollShadow>
  );
}
