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

export function AddProductDialog() {
  const t = useTranslations('AddProductDialog');
  const { isAddDialogOpen, setAddDialogOpen } = useProductManagementStore();

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
      <DialogContent className="sm:max-w-[48rem]">
        <DialogHeader>
          <DialogTitle>{t('add_product')}</DialogTitle>
          <DialogDescription className="sr-only">
            {t('form_description')}
          </DialogDescription>
        </DialogHeader>
        <ProductForm />
      </DialogContent>
    </Dialog>
  );
}
