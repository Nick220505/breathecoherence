'use client';

import { useTranslations } from 'next-intl';

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { ProductForm } from './product-form';

export function AddProductDialog() {
  const t = useTranslations('AddProductDialog');

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t('add_product')}</DialogTitle>
        <DialogDescription className="sr-only">
          {t('form_description')}
        </DialogDescription>
      </DialogHeader>
      <ProductForm />
    </DialogContent>
  );
}
