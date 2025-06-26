import { Users } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { getUserCount } from '@/features/user/actions';

export async function UsersCard() {
  const t = await getTranslations('dashboard');
  const userCount = await getUserCount();

  return (
    <div className="bg-card flex items-center justify-center gap-6 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md max-[475px]:flex-col max-[475px]:gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
        <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold">{userCount}</div>
        <div className="text-muted-foreground text-sm font-medium">
          {t('usersLabel')}
        </div>
      </div>
    </div>
  );
}
