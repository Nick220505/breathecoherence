'use client';

import { useTranslations } from 'next-intl';
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

import { useCategoryStore } from './store';

export function DeleteCategoryDialog() {
  const t = useTranslations('DeleteProductDialog');
  const { isDeleteDialogOpen, setDeleteDialogOpen, deletingCategory } =
    useCategoryStore();

  const handleOpenChange = (open: boolean) => {
    setDeleteDialogOpen(open);
  };

  const handleDelete = () => {
    if (!deletingCategory) return;

    toast.success(t('deleted_title'), {
      description: t('deleted_description', {
        name: deletingCategory.name,
      }),
    });
    setDeleteDialogOpen(false);
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
            disabled={false}
          >
            {t('cancel')}
          </Button>
          <Button onClick={handleDelete} disabled={false}>
            {t('confirm_delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
