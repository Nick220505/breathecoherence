'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { getAllCategories } from '@/features/category/actions';

import { TableSkeleton } from '../product-management/table-skeleton';

import { AddCategoryButton } from './add-category-button';
import { AddCategoryDialog } from './add-category-dialog';
import { CategoryTable } from './category-table';
import { DeleteCategoryDialog } from './delete-category-dialog';
import { EditCategoryDialog } from './edit-category-dialog';

import type { Category } from '@prisma/client';

export function CategoryManagement() {
  const t = useTranslations('dashboard');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getAllCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchCategories();
  }, []);

  return (
    <Dialog>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('categoryTable.title')}</CardTitle>
              <CardDescription>
                {t('categoryTable.description')}
              </CardDescription>
            </div>
            <AddCategoryButton />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <CategoryTable categories={categories} />
          )}
        </CardContent>
      </Card>
      <AddCategoryDialog />
      <EditCategoryDialog />
      <DeleteCategoryDialog />
    </Dialog>
  );
}
