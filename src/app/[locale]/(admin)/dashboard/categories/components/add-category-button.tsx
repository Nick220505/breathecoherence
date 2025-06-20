'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

import { useCategoryStore } from './store';

export function AddCategoryButton() {
  const t = useTranslations('dashboard');
  const { setAddDialogOpen } = useCategoryStore();

  return (
    <Button onClick={() => setAddDialogOpen(true)}>
      <Plus className="mr-2 h-4 w-4" />
      {t('addCategory')}
    </Button>
  );
}
