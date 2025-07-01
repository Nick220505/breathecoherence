'use client';

import { Folder, Home, Package, ShoppingCart, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link, usePathname } from '@/i18n/routing';
import { cn } from '@/lib/utils';

interface NavItem {
  href: React.ComponentProps<typeof Link>['href'];
  label: string;
  icon: React.ElementType;
  exact?: boolean;
}

export function SidebarNav() {
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
