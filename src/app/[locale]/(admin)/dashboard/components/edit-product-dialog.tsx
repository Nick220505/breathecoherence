'use client';

import { useTranslations } from 'next-intl';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useProductStore } from '@/lib/stores/use-product-store';

import { ProductForm } from './product-form';

export function EditProductDialog() {
  const t = useTranslations('EditProductDialog');
  const {
    isEditDialogOpen,
    setEditDialogOpen,
    editingProduct,
    setEditingProduct,
  } = useProductStore();

  if (!editingProduct) return null;

  return (
    <Dialog
      open={isEditDialogOpen}
      onOpenChange={(open) => {
        setEditDialogOpen(open);
        if (!open) setEditingProduct(null);
      }}
    >
      <DialogContent>
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
