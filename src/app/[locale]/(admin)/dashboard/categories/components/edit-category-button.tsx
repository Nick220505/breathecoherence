'use client';

import { Edit } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { CategoryDialog } from './category-dialog';

import type { Category } from '@prisma/client';

interface EditCategoryButtonProps {
  category: Category;
}

export function EditCategoryButton({
  category,
}: Readonly<EditCategoryButtonProps>) {
  return (
    <CategoryDialog category={category}>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Edit className="h-4 w-4" />
      </Button>
    </CategoryDialog>
  );
}
