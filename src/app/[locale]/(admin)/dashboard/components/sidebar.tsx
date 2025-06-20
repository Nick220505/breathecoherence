'use client';

import { Folder, Home, Package, ShoppingCart, Users } from 'lucide-react';
import { ComponentProps } from 'react';

import { Link, usePathname } from '@/i18n/routing';
import { cn } from '@/lib/utils';

interface NavItem {
  href: ComponentProps<typeof Link>['href'];
  label: string;
  icon: React.ElementType;
  exact?: boolean;
}

function SidebarNav() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { href: '/dashboard', label: 'Dashboard', icon: Home, exact: true },
    { href: '/dashboard/products', label: 'Products', icon: Package },
    { href: '/dashboard/categories', label: 'Categories', icon: Folder },
    { href: '/dashboard/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/dashboard/users', label: 'Users', icon: Users },
  ];

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : typeof item.href === 'string' && pathname.startsWith(item.href);
        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              'text-muted-foreground hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all',
              isActive && 'bg-muted text-primary',
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarHeader() {
  return (
    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
      <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
        <Package className="h-6 w-6" />
        <span className="">Admin Panel</span>
      </Link>
    </div>
  );
}

export function Sidebar() {
  return (
    <div className="bg-muted/40 hidden border-r md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <SidebarHeader />
        <div className="flex-1">
          <SidebarNav />
        </div>
      </div>
    </div>
  );
}

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
