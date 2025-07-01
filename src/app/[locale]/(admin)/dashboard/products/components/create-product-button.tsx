'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { CreateProductDialog } from './create-product-dialog';

export function CreateProductButton() {
  const t = useTranslations('CreateProductButton');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        {t('add_product')}
      </Button>

      <CreateProductDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
