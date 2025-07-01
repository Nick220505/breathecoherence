import { getTranslations } from 'next-intl/server';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllCategories } from '@/features/category/actions';

import { CreateCategoryButton } from './components/create-category-button';
import { CategoryTable } from './components/category-table';

export default async function CategoriesPage() {
  const t = await getTranslations('CategoriesPage');
  const [categories, err] = await getAllCategories();

  if (err) {
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
