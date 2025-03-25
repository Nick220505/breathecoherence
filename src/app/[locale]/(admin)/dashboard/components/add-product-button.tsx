'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { useProductStore } from '@/lib/stores/use-product-store';

import { AddProductDialog } from './add-product-dialog';

export function AddProductButton() {
  const t = useTranslations('AddProductButton');
  const { setAddDialogOpen } = useProductStore();

  return (
    <>
      <Button
        onClick={() => setAddDialogOpen(true)}
        className="bg-primary hover:bg-primary/90"
        size="sm"
      >
        {t('add_product')}
        <Plus className="ml-2 h-4 w-4" />
      </Button>

      <AddProductDialog />
    </>
  );
}
