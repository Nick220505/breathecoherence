'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useCategoryStore } from './store';

export interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
}

interface CategoryTableProps {
  readonly categories: Category[];
}

export function CategoryTable({ categories }: CategoryTableProps) {
  const t = useTranslations('dashboard');
  const {
    setEditDialogOpen,
    setEditingCategory,
    setDeleteDialogOpen,
    setDeletingCategory,
  } = useCategoryStore();

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setEditDialogOpen(true);
  };

  const handleDelete = (category: Category) => {
    setDeletingCategory(category);
    setDeleteDialogOpen(true);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('categoryTable.name')}</TableHead>
          <TableHead>{t('categoryTable.description')}</TableHead>
          <TableHead>{t('categoryTable.createdAt')}</TableHead>
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
              {new Date(category.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(category)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(category)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
