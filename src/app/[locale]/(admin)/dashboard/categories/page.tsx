import { getTranslations } from 'next-intl/server';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllCategories } from '@/features/category/actions';

import { CategoryTable } from './components/category-table';
import { CreateCategoryButton } from './components/create-category-button';

export default async function CategoriesPage() {
  const t = await getTranslations('CategoriesPage');
  const { data: categories, serverError } = await getAllCategories();

  if (serverError || !categories) {
    throw new Error(t('error.loadCategories'));
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t('title')}</CardTitle>
          <CreateCategoryButton />
        </div>
      </CardHeader>
      <CardContent>
        <CategoryTable categories={categories} />
      </CardContent>
    </Card>
  );
}
