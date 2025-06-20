'use client';

import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
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
  const {
    isDeleteDialogOpen,
    productToDelete,
    setIsDeleting,
    resetDeleteState,
  } = useProductManagementStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    setIsLoading(true);
    setIsDeleting(true);

    const { success, message, data } = await deleteProduct(productToDelete.id);

    if (success) {
      toast.success(t('deleted_title'), {
        description: t('deleted_description', { name: data?.name ?? '' }),
      });
      resetDeleteState();
    } else {
      toast.error(t('error'), { description: message });
    }

    setIsLoading(false);
    setIsDeleting(false);
  };

  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={resetDeleteState}>
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
            onClick={resetDeleteState}
            disabled={isLoading}
          >
            {t('cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={() => void handleConfirmDelete()}
            disabled={isLoading}
          >
            {isLoading ? (
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
