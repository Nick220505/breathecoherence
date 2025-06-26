import { Folder } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { getCategoryCount } from '@/features/category/actions';

export async function CategoriesCard() {
  const t = await getTranslations('dashboard');
  const categoryCount = await getCategoryCount();

  return (
    <div className="bg-card flex items-center justify-center gap-6 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md max-[475px]:flex-col max-[475px]:gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
        <Folder className="h-6 w-6 text-green-600 dark:text-green-400" />
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold">{categoryCount}</div>
        <div className="text-muted-foreground text-sm font-medium">
          {t('categoriesLabel')}
        </div>
      </div>
    </div>
  );
}
