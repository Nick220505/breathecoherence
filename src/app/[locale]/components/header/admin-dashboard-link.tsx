'use client';

import { LayoutDashboard } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

export function AdminDashboardLink() {
  const t = useTranslations('AdminDashboardLink');
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';

  if (!isAdmin) return null;

  return (
    <div>
      <Link href="/dashboard" className="w-full">
        <Button
          variant="ghost"
          className="hover:bg-primary/10 flex w-full items-center justify-start gap-2 transition-colors duration-300 md:w-auto"
        >
          <LayoutDashboard className="h-4 w-4" />
          {t('dashboard')}
        </Button>
      </Link>
    </div>
  );
}
