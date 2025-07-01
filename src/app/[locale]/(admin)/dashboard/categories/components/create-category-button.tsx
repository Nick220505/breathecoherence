'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { CreateCategoryDialog } from './create-category-dialog';

export function CreateCategoryButton() {
  const t = useTranslations('CreateCategoryButton');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        {t('add_category')}
      </Button>

      <CreateCategoryDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
