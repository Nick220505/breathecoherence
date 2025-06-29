import { Plus } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { CategoryDialog } from './components/category-dialog';
import { CategoryTable } from './components/category-table';
import { CategoryTableSkeleton } from './components/category-table-skeleton';

export default async function CategoriesPage() {
  const t = await getTranslations('CategoriesPage');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t('title')}</CardTitle>
          <CategoryDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('add_category')}
            </Button>
          </CategoryDialog>
        </div>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<CategoryTableSkeleton />}>
          <CategoryTable />
        </Suspense>
      </CardContent>
    </Card>
  );
}
