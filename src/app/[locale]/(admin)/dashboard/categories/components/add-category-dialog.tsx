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

export function AddCategoryDialog() {
  const t = useTranslations('AddCategoryDialog');
  const { isAddDialogOpen, setAddDialogOpen } = useCategoryStore();

  const handleOpenChange = (open: boolean) => {
    setAddDialogOpen(open);
  };

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('add_category')}</DialogTitle>
          <DialogDescription className="sr-only">
            {t('form_description')}
          </DialogDescription>
        </DialogHeader>
        <CategoryForm />
      </DialogContent>
    </Dialog>
  );
}
