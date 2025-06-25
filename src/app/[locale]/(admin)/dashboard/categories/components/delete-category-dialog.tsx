'use client';

import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef, useTransition, type ReactNode } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { deleteCategory } from '@/features/category/actions';

import type { Category } from '@prisma/client';

interface DeleteCategoryDialogProps {
  children: ReactNode;
  category: Category;
}

export function DeleteCategoryDialog({
  children,
  category,
}: Readonly<DeleteCategoryDialogProps>) {
  const t = useTranslations('DeleteCategoryDialog');
  const [isPending, startTransition] = useTransition();
  const closeRef = useRef<HTMLButtonElement>(null);

  const handleDelete = () => {
    startTransition(async () => {
      const { success } = await deleteCategory(category.id);

      if (success) {
        toast.success(t('deleted_title'), {
          description: t('deleted_description', {
            name: category.name,
          }),
        });
        closeRef.current?.click();
      } else {
        toast.error(t('error_delete'));
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('delete_confirm_title')}</DialogTitle>
          <DialogDescription>
            {t('delete_confirm_description')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button ref={closeRef} variant="outline" disabled={isPending}>
              {t('cancel')}
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('deleting')}
              </>
            ) : (
              t('confirm_delete')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
