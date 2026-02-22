'use client';

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
import { deleteUser } from '@/features/user/actions';
import { USER_HAS_ORDERS } from '@/features/user/errors';
import type { UserSummary } from '@/features/user/schemas';

interface DeleteUserDialogProps extends React.ComponentProps<typeof Dialog> {
  user: UserSummary;
}

export function DeleteUserDialog({
  user,
  onOpenChange,
  ...props
}: Readonly<DeleteUserDialogProps>) {
  const t = useTranslations('DeleteUserDialog');

  const { execute, isExecuting } = useAction(deleteUser, {
    onSuccess: ({ data: { name } }) => {
      toast.success(t('deleted_title'), {
        description: t('deleted_description', { name }),
      });
      onOpenChange?.(false);
    },
    onError: ({ error: { serverError } }) => {
      let errorMessage = t('error_delete');

      if (serverError === USER_HAS_ORDERS) {
        errorMessage = t('error_has_orders');
      }

      toast.error(errorMessage);
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
            onClick={() => execute(user.id)}
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
