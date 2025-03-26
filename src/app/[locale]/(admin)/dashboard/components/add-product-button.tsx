'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

import { AddProductDialog } from './add-product-dialog';

export function AddProductButton() {
  const t = useTranslations('AddProductButton');
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90" size="sm">
          {t('add_product')}
          <Plus className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>

      <AddProductDialog />
    </Dialog>
  );
}
