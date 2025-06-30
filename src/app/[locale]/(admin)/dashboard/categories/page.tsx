import { Plus } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllCategories } from '@/features/category/actions';

import { CreateCategoryDialog } from './components/create-category-dialog';
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
          <CreateCategoryDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('add_category')}
            </Button>
          </CreateCategoryDialog>
        </div>
      </CardHeader>
      <CardContent>
        <CategoryTable categories={categories} />
      </CardContent>
    </Card>
  );
}
