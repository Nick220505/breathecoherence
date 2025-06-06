'use client';

import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

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
import { useToast } from '@/hooks/use-toast';
import { useTableStore } from '@/lib/stores/use-table-store';

export function DeleteProductDialog() {
  const t = useTranslations('DeleteProductDialog');
  const { toast } = useToast();
  const {
    isDeleteDialogOpen,
    productToDelete,
    setIsDeleting,
    resetDeleteState,
  } = useTableStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    setIsLoading(true);
    setIsDeleting(true);

    const { success, message, data } = await deleteProduct(productToDelete.id);

    if (success) {
      toast({
        title: t('deleted_title'),
        description: t('deleted_description', { name: data?.name ?? '' }),
        variant: 'default',
      });
      resetDeleteState();
    } else {
      toast({
        title: t('error'),
        description: message,
        variant: 'destructive',
      });
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
