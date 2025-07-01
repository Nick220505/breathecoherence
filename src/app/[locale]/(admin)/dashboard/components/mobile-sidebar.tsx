import { SidebarHeader } from './sidebar-header';
import { SidebarNav } from './sidebar-nav';

export function MobileSidebar() {
  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <SidebarHeader />
      <div className="flex-1">
        <SidebarNav />
      </div>
    </div>
  );
}
