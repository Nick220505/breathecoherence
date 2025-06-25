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
import { deleteUser } from '@/features/user/actions';

import { useUserManagementStore } from './store';

export function DeleteUserDialog() {
  const t = useTranslations('DeleteUserDialog');
  const { isDeleteDialogOpen, resetDeleteState, userToDelete } =
    useUserManagementStore();
  const [isPending, startTransition] = useTransition();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetDeleteState();
    }
  };

  const handleDelete = () => {
    if (!userToDelete) return;

    startTransition(async () => {
      const { success } = await deleteUser(userToDelete.id);

      if (success) {
        toast.success(t('deleted_title'), {
          description: t('deleted_description', {
            name: userToDelete.name,
          }),
        });
      } else {
        toast.error(t('error_delete'));
      }

      resetDeleteState();
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
            onClick={() => resetDeleteState()}
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
