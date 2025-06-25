'use client';

import { Edit } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { CategoryForm } from './category-form';

import type { Category } from '@prisma/client';

interface EditCategoryButtonProps {
  category: Category;
}

export function EditCategoryButton({
  category,
}: Readonly<EditCategoryButtonProps>) {
  const t = useTranslations('EditCategoryDialog');
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('edit_category')}</DialogTitle>
          <DialogDescription className="sr-only">
            {t('form_description')}
          </DialogDescription>
        </DialogHeader>
        <CategoryForm initialData={category} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
