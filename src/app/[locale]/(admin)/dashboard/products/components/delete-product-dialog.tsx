'use client';

import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { toast } from 'sonner';
import { useServerAction } from 'zsa-react';

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
import { deleteProduct } from '@/features/product/actions';

import type { ProductWithCategory } from '@/features/product/types';

interface DeleteProductDialogProps {
  product: ProductWithCategory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteProductDialog({
  product,
  open,
  onOpenChange,
}: Readonly<DeleteProductDialogProps>) {
  const t = useTranslations('DeleteProductDialog');
  const closeRef = useRef<HTMLButtonElement>(null);

  const { execute, isPending } = useServerAction(deleteProduct, {
    onSuccess: ({ data: { name } }) => {
      toast.success(t('deleted_title'), {
        description: t('deleted_description', { name }),
      });
      onOpenChange(false);
    },
    onError: ({ err: { message } }) => {
      toast.error(message ?? t('error_delete'));
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onClick={() => execute({ id: product.id })}
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
