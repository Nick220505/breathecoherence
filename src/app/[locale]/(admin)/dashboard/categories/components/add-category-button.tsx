'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

import { CategoryDialog } from './category-dialog';

export function AddCategoryButton() {
  const t = useTranslations('dashboard');

  return (
    <CategoryDialog>
      <Button>
        <Plus className="mr-2 h-4 w-4" />
        {t('addCategory')}
      </Button>
    </CategoryDialog>
  );
}
