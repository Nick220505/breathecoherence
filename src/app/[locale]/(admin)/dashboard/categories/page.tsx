import { getTranslations } from 'next-intl/server';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllCategories } from '@/features/category/actions';

import { AddCategoryDialog } from './components/add-category-dialog';
import { CategoryTable } from './components/category-table';
import { DeleteCategoryDialog } from './components/delete-category-dialog';
import { EditCategoryDialog } from './components/edit-category-dialog';

export default async function CategoriesPage() {
  const categories = await getAllCategories();
  const t = await getTranslations('dashboard');

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('categoryTable.title')}</CardTitle>
            <AddCategoryDialog />
          </div>
        </CardHeader>
        <CardContent>
          <CategoryTable categories={categories} />
        </CardContent>
      </Card>
      <EditCategoryDialog />
      <DeleteCategoryDialog />
    </>
  );
}
