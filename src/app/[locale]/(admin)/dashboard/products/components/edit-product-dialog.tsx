'use client';

import { useTranslations } from 'next-intl';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { ProductForm } from './product-form';
import { useProductManagementStore } from './store';

export function EditProductDialog() {
  const t = useTranslations('EditProductDialog');
  const { isEditDialogOpen, setEditDialogOpen, editingProduct } =
    useProductManagementStore();

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
      <DialogContent className="sm:max-w-[48rem]">
        <DialogHeader>
          <DialogTitle>{t('edit_product')}</DialogTitle>
          <DialogDescription className="sr-only">
            {t('form_description')}
          </DialogDescription>
        </DialogHeader>
        <ProductForm initialData={editingProduct ?? undefined} />
      </DialogContent>
    </Dialog>
  );
}
