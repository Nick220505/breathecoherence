import { Edit, Trash2 } from 'lucide-react';
import { getTranslations, getLocale } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getAllCategories } from '@/features/category/actions';

import { CategoryDialog } from './category-dialog';
import { DeleteCategoryDialog } from './delete-category-dialog';

export async function CategoryTable() {
  const t = await getTranslations('dashboard');
  const locale = await getLocale();
  const categories = await getAllCategories();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('categoryTable.name')}</TableHead>
          <TableHead>{t('categoryTable.description')}</TableHead>
          <TableHead>{t('categoryTable.createdAt')}</TableHead>
          <TableHead>{t('categoryTable.updatedAt')}</TableHead>
          <TableHead className="text-right">
            {t('categoryTable.actions')}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell className="font-medium">{category.name}</TableCell>
            <TableCell>{category.description ?? ''}</TableCell>
            <TableCell>
              {new Intl.DateTimeFormat(locale, {
                dateStyle: 'medium',
                timeStyle: 'short',
              }).format(category.createdAt)}
            </TableCell>
            <TableCell>
              {new Intl.DateTimeFormat(locale, {
                dateStyle: 'medium',
                timeStyle: 'short',
              }).format(category.updatedAt)}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <CategoryDialog category={category}>
                  <Button size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </CategoryDialog>
                <DeleteCategoryDialog category={category}>
                  <Button variant="destructive" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </DeleteCategoryDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
