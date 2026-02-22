'use client';

import type { Category } from '@/generated/prisma/browser';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useAction } from 'next-safe-action/hooks';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { deleteCategory } from '@/features/category/actions';

interface DeleteCategoryDialogProps extends React.ComponentProps<
  typeof Dialog
> {
  category: Category;
}

export function DeleteCategoryDialog({
  category,
  onOpenChange,
  ...props
}: Readonly<DeleteCategoryDialogProps>) {
  const t = useTranslations('DeleteCategoryDialog');

  const { execute, isExecuting } = useAction(deleteCategory, {
    onSuccess: ({ data: { name } }) => {
      toast.success(t('deleted_title'), {
        description: t('deleted_description', { name }),
      });
      onOpenChange?.(false);
    },
    onError: ({ error: { serverError } }) => {
      toast.error(serverError ?? t('error_delete'));
    },
  });

  return (
    <Dialog onOpenChange={onOpenChange} {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('delete_confirm_title')}</DialogTitle>
          <DialogDescription>
            {t('delete_confirm_description')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isExecuting}>
              {t('cancel')}
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() => execute(category.id)}
            disabled={isExecuting}
          >
            {isExecuting ? (
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
