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
import { deleteUser } from '@/features/user/actions';

import { useUserManagementStore } from './store';

export function DeleteUserDialog() {
  const t = useTranslations('DeleteUserDialog');
  const { isDeleteDialogOpen, resetDeleteState, userToDelete, setIsDeleting } =
    useUserManagementStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setIsLoading(true);
    if (setIsDeleting) setIsDeleting(true);
    const result = await deleteUser(userToDelete.id);
    if (result.success) {
      toast.success(t('deleted_title'), {
        description: t('deleted_description', { name: userToDelete.name }),
      });
      resetDeleteState();
    } else {
      toast.error(t('error_delete'));
    }
    setIsLoading(false);
    if (setIsDeleting) setIsDeleting(false);
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
        <DialogFooter>
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
