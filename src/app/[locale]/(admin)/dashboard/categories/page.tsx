import { getTranslations } from 'next-intl/server';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { AddCategoryButton } from './components/add-category-button';
import { CategoryTable } from './components/category-table';

export default async function CategoriesPage() {
  const t = await getTranslations('dashboard');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t('categoryTable.title')}</CardTitle>
          <AddCategoryButton />
        </div>
      </CardHeader>
      <CardContent>
        <CategoryTable />
      </CardContent>
    </Card>
  );
}
