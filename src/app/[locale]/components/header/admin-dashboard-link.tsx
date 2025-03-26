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
      <Link href="/dashboard">
        <Button
          variant="ghost"
          className="hover:bg-primary/10 transition-colors duration-300"
        >
          {t('nav.dashboard')}
        </Button>
      </Link>
    </div>
  );
}
