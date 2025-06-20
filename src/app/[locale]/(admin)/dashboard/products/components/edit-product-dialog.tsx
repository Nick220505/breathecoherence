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
  const {
    isEditDialogOpen,
    setEditDialogOpen,
    editingProduct,
    setEditingProduct,
  } = useProductManagementStore();

  if (!editingProduct) return null;

  return (
    <Dialog
      open={isEditDialogOpen}
      onOpenChange={(open) => {
        setEditDialogOpen(open);
        if (!open) setEditingProduct(null);
      }}
    >
      <DialogContent className="sm:max-w-[40rem]">
        <DialogHeader>
          <DialogTitle>{t('edit_product')}</DialogTitle>
          <DialogDescription className="sr-only">
            {t('form_description')}
          </DialogDescription>
        </DialogHeader>
        <ProductForm initialData={editingProduct} />
      </DialogContent>
    </Dialog>
  );
}
