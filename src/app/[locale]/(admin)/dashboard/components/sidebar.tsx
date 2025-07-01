import { SidebarHeader } from './sidebar-header';
import { SidebarNav } from './sidebar-nav';

export function Sidebar() {
  return (
    <div className="bg-muted/40 hidden border-r md:fixed md:top-16 md:left-0 md:block md:h-[calc(100vh-4rem)] md:w-[220px] lg:w-[280px]">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <SidebarHeader />
        <div className="flex-1">
          <SidebarNav />
        </div>
      </div>
    </div>
  );
}

// Re-export MobileSidebar from its own file
export { MobileSidebar } from './mobile-sidebar';
