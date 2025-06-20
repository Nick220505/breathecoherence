'use client';

import { useTranslations } from 'next-intl';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';

import { AddCategoryButton } from './add-category-button';
import { AddCategoryDialog } from './add-category-dialog';
import { CategoryTable } from './category-table';
import { DeleteCategoryDialog } from './delete-category-dialog';
import { EditCategoryDialog } from './edit-category-dialog';

import type { Category } from '@prisma/client';

export function CategoryManagement({
  categories,
}: Readonly<{ categories: Category[] }>) {
  const t = useTranslations('dashboard');

  return (
    <Dialog>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('categoryTable.title')}</CardTitle>
            <AddCategoryButton />
          </div>
        </CardHeader>
        <CardContent>
          <CategoryTable categories={categories} />
        </CardContent>
      </Card>
      <AddCategoryDialog />
      <EditCategoryDialog />
      <DeleteCategoryDialog />
    </Dialog>
  );
}
