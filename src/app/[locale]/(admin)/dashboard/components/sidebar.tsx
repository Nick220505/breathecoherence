'use client';

import { Folder, Home, Package, ShoppingCart, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('SidebarNav');

  const navItems: NavItem[] = [
    { href: '/dashboard', label: t('dashboard'), icon: Home, exact: true },
    { href: '/dashboard/products', label: t('products'), icon: Package },
    { href: '/dashboard/categories', label: t('categories'), icon: Folder },
    { href: '/dashboard/orders', label: t('orders'), icon: ShoppingCart },
    { href: '/dashboard/users', label: t('users'), icon: Users },
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
  const t = useTranslations('SidebarHeader');
  return (
    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
      <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
        <Package className="h-6 w-6" />
        <span>{t('panel')}</span>
      </Link>
    </div>
  );
}

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
