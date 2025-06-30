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
import { deleteUser } from '@/features/user/actions';

import type { UserSummary } from '@/features/user/types';

interface DeleteUserDialogProps {
  user: UserSummary;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteUserDialog({
  user,
  open,
  onOpenChange,
}: Readonly<DeleteUserDialogProps>) {
  const t = useTranslations('DeleteUserDialog');
  const closeRef = useRef<HTMLButtonElement>(null);

  const { execute, isPending } = useServerAction(deleteUser, {
    onSuccess: () => {
      toast.success(t('deleted_title'), {
        description: t('deleted_description', {
          name: user.name,
        }),
      });
      onOpenChange(false);
    },
    onError: () => {
      toast.error(t('error_delete'));
    },
  });

  const handleDelete = () => {
    execute({ id: user.id });
  };

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
