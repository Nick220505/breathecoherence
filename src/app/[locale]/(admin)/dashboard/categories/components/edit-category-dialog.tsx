'use client';

import { useTranslations } from 'next-intl';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { CategoryForm } from './category-form';
import { useCategoryStore } from './store';

export function EditCategoryDialog() {
  const t = useTranslations('EditCategoryDialog');
  const { isEditDialogOpen, setEditDialogOpen, editingCategory } =
    useCategoryStore();

  const handleOpenChange = (open: boolean) => {
    setEditDialogOpen(open);
  };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('edit_category')}</DialogTitle>
          <DialogDescription className="sr-only">
            {t('form_description')}
          </DialogDescription>
        </DialogHeader>
        <CategoryForm initialData={editingCategory ?? undefined} />
      </DialogContent>
    </Dialog>
  );
}
