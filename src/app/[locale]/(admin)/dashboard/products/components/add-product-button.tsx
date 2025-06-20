'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

import { useProductManagementStore } from './store';

export function AddProductButton() {
  const t = useTranslations('AddProductButton');
  const { setAddDialogOpen } = useProductManagementStore();

  return (
    <Button
      onClick={() => setAddDialogOpen(true)}
      className="bg-primary hover:bg-primary/90"
      size="sm"
    >
      {t('add_product')}
      <Plus className="ml-2 h-4 w-4" />
    </Button>
  );
}
