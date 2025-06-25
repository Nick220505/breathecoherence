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
import { deleteProduct } from '@/features/product/actions';

import { useProductManagementStore } from './store';

export function DeleteProductDialog() {
  const t = useTranslations('DeleteProductDialog');
  const { isDeleteDialogOpen, setDeleteDialogOpen, deletingProduct } =
    useProductManagementStore();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!deletingProduct) return;

    startTransition(async () => {
      const { success } = await deleteProduct(deletingProduct.id);

      if (success) {
        toast.success(t('deleted_title'), {
          description: t('deleted_description', {
            name: deletingProduct.name,
          }),
        });
      } else {
        toast.error(t('error'));
      }

      setDeleteDialogOpen(false);
    });
  };

  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('delete_confirm_title')}</DialogTitle>
          <DialogDescription>
            {t('delete_confirm_description')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end space-x-2">
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
