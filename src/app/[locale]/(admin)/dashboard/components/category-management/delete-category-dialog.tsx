'use client';

import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { deleteCategory } from '@/features/category/actions';

import { useCategoryStore } from './store';

export function DeleteCategoryDialog() {
  const t = useTranslations('DeleteCategoryDialog');
  const { isDeleteDialogOpen, setDeleteDialogOpen, deletingCategory } =
    useCategoryStore();
  const [isPending, startTransition] = useTransition();

  const handleOpenChange = (open: boolean) => {
    setDeleteDialogOpen(open);
  };

  const handleDelete = () => {
    if (!deletingCategory) return;

    startTransition(async () => {
      const result = await deleteCategory(deletingCategory.id);

      if (result.success) {
        toast.success(t('deleted_title'), {
          description: t('deleted_description', {
            name: deletingCategory.name,
          }),
        });
      } else {
        toast.error(t('error_delete'));
      }

      setDeleteDialogOpen(false);
    });
  };

  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('delete_confirm_title')}</DialogTitle>
          <DialogDescription>
            {t('delete_confirm_description')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setDeleteDialogOpen(false)}
            disabled={isPending}
          >
            {t('cancel')}
          </Button>
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
