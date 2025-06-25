import { getTranslations, getLocale } from 'next-intl/server';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getAllCategories } from '@/features/category/actions';

import { DeleteCategoryDialog } from './delete-category-dialog';
import { EditCategoryDialog } from './edit-category-dialog';

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
              }).format(new Date(category.createdAt))}
            </TableCell>
            <TableCell>
              {new Intl.DateTimeFormat(locale, {
                dateStyle: 'medium',
                timeStyle: 'short',
              }).format(new Date(category.updatedAt))}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <EditCategoryDialog category={category} />
                <DeleteCategoryDialog category={category} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
