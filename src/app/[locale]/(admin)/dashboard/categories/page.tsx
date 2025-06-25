import { Plus } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { CategoryDialog } from './components/category-dialog';
import { CategoryTable } from './components/category-table';

export default async function CategoriesPage() {
  const t = await getTranslations('dashboard');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t('categoryTable.title')}</CardTitle>
          <CategoryDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('addCategory')}
            </Button>
          </CategoryDialog>
        </div>
      </CardHeader>
      <CardContent>
        <CategoryTable />
      </CardContent>
    </Card>
  );
}
