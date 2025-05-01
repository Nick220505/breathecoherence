import { getTranslations } from 'next-intl/server';

import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

export async function AdminDashboardLink() {
  const t = await getTranslations('Navigation');
  const session = await auth();
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
