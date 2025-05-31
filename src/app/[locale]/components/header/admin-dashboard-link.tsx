'use client';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

export function AdminDashboardLink() {
  const t = useTranslations('Navigation');
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';

  if (!isAdmin) return null;

  return (
    <div>
      <Link href="/dashboard" className="w-full">
        <Button
          variant="ghost"
          className="hover:bg-primary/10 w-full justify-start transition-colors duration-300 md:w-auto"
        >
          {t('nav.dashboard')}
        </Button>
      </Link>
    </div>
  );
}
